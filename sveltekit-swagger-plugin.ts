import ts from 'typescript';
import fs from 'node:fs/promises';
import path from 'node:path';
import AwaitLock from 'await-lock';
import openapiTS, { astToString, type OpenAPI3 } from 'openapi-typescript';

import {
	Node,
	Type,
	Project,
	SyntaxKind,
	ThrowStatement,
	ReturnStatement,
	FileSystemRefreshResult
} from 'ts-morph';
import type { Plugin } from 'vite';
import type { OpenAPIV3 } from 'openapi-types';

interface Endpoint {
	path: string;
	method: string;
	responses: OpenAPIV3.ResponsesObject;
	parameters?: OpenAPIV3.ParameterObject[];
	requestBody?: OpenAPIV3.RequestBodyObject;
}

interface MergedOptions {
	output: { types: string; swagger: string };
	swagger: Omit<OpenAPIV3.Document, 'openapi' | 'paths'>;
	include?: string[];
}

interface PluginOptions {
	output?: MergedOptions['output'];
	swagger: MergedOptions['swagger'];
	include?: MergedOptions['include'];
}

const statusCodes: Record<number, string | undefined> = {
	200: 'OK',
	201: 'Created',
	204: 'No Content',
	400: 'Bad Request',
	401: 'Unauthorized',
	403: 'Forbidden',
	404: 'Not Found',
	409: 'Conflict',
	500: 'Internal Server Error'
};

const createSwagger = (options: MergedOptions, endpoints: Endpoint[]): OpenAPIV3.Document => {
	const paths: Record<string, OpenAPIV3.PathItemObject> = {};

	for (const endpoint of endpoints.toSorted((a, b) => a.path.localeCompare(b.path))) {
		paths[endpoint.path] = {
			...paths[endpoint.path],
			[endpoint.method]: {
				responses: endpoint.responses,
				parameters: endpoint.parameters
			}
		};
	}

	return {
		openapi: '3.0.0',
		...options.swagger,
		paths
	};
};

const createProject = (options: MergedOptions) => {
	const project = new Project({
		tsConfigFilePath: ts.findConfigFile(
			process.cwd(),
			ts.sys.fileExists,
			path.join('.svelte-kit', 'tsconfig.json')
		),
		skipAddingFilesFromTsConfig: options.include !== undefined
	});

	if (options.include) {
		project.addSourceFilesAtPaths(options.include);
		project.resolveSourceFileDependencies();
	}
	return project;
};

const typeToJsonSchema = (type: Type, location: Node): OpenAPIV3.SchemaObject => {
	if (type.getText().includes('ReadableStream')) {
		return { type: 'string', format: 'binary' };
	} else if (type.isString() || type.isStringLiteral()) {
		if (type.isStringLiteral()) {
			return { type: 'string', enum: [type.getText()] };
		}
		return { type: 'string' };
	} else if (type.isNumber() || type.isNumberLiteral()) {
		return { type: 'number' };
	} else if (type.isBoolean() || type.isBooleanLiteral()) {
		return { type: 'boolean' };
	} else if (type.isArray()) {
		return { type: 'array', items: typeToJsonSchema(type.getArrayElementType()!, location) };
	} else if (type.isObject()) {
		return {
			type: 'object',
			required: type
				.getProperties()
				.filter((property) => {
					if (property.hasFlags(ts.SymbolFlags.Optional)) {
						return false;
					}
					return true;
				})
				.map((p) => p.getName()),
			properties: type.getProperties().reduce(
				(acc, property) => {
					acc[property.getName()] = typeToJsonSchema(
						property.getTypeAtLocation(location),
						location
					);
					return acc;
				},
				{} as Record<string, OpenAPIV3.SchemaObject>
			)
		};
	}
	return {};
};

const parseResponseInit = (responseInitNode: Node) => {
	const properties = responseInitNode.getDescendantsOfKind(SyntaxKind.PropertyAssignment);
	const statusNode = properties
		.find((property) => property.getName() === 'status')
		?.getInitializerIfKind(SyntaxKind.NumericLiteral);
	const headersNode = properties
		.find((property) => property.getName().toLowerCase() === 'headers')
		?.getDescendantsOfKind(SyntaxKind.PropertyAssignment);
	const contentTypeNode = headersNode
		?.find((property) => property.getName().toLowerCase() === "'content-type'")
		?.getInitializerIfKind(SyntaxKind.StringLiteral);

	return {
		status: statusNode?.getLiteralValue(),
		contentType: contentTypeNode?.getLiteralValue()
	};
};

const parseThrowStatement = (throwStatement: ThrowStatement) => {
	const callExpression = throwStatement.getExpressionIfKind(SyntaxKind.CallExpression);
	if (callExpression) {
		if (callExpression.getExpression().getText() === 'error') {
			const [statusNode, bodyNode] = callExpression.getArguments();

			if (Node.isNumericLiteral(statusNode)) {
				return {
					body: bodyNode
						? typeToJsonSchema(bodyNode.getType(), bodyNode)
						: ({ type: 'string' } satisfies OpenAPIV3.SchemaObject),
					status: statusNode.getLiteralValue(),
					contentType: 'text/plain'
				};
			}
		}
	}
};

const parseReturnStatement = (returnStatement: ReturnStatement) => {
	const newExpression = returnStatement.getExpressionIfKind(SyntaxKind.NewExpression);
	if (newExpression) {
		if (newExpression.getExpression().getText() === 'Response') {
			const [bodyNode, responseInitNode] = newExpression.getArguments();
			const { status, contentType } = responseInitNode ? parseResponseInit(responseInitNode) : {};

			return {
				body: typeToJsonSchema(bodyNode.getType(), bodyNode),
				status: status ?? 200, // new Response() defaults to 200
				contentType: contentType ?? 'text/plain' // new Response() defaults to text/plain in SvelteKit
			};
		}
	}

	const callExpression = returnStatement.getExpressionIfKind(SyntaxKind.CallExpression);
	if (callExpression) {
		const text = callExpression.getExpression().getText();

		switch (text) {
			case 'json': {
				const [bodyNode, responseInitNode] = callExpression.getArguments();
				const { status, contentType } = responseInitNode ? parseResponseInit(responseInitNode) : {};

				return {
					body: typeToJsonSchema(bodyNode.getType(), bodyNode),
					status: status ?? 200, // calling json({}) defaults to 200
					contentType: contentType ?? 'application/json' // calling json({...}) defaults to application/json
				};
			}
			case 'text': {
				const [, responseInitNode] = callExpression.getArguments();
				const { status, contentType } = responseInitNode ? parseResponseInit(responseInitNode) : {};

				return {
					body: { type: 'string' } satisfies OpenAPIV3.SchemaObject,
					status: status ?? 200, // calling text('...') defaults to 200
					contentType: contentType ?? 'text/plain' // calling text('...') defaults to text/plain
				};
			}
		}
	}
};

const parseEndpointHandler = (project: Project, filePath: string) => {
	const path = getEndpointHandlerPath(filePath);
	const endpoints: Endpoint[] = [];
	const sourceFile = project.getSourceFile(filePath);
	const parameters = path.match(/{([^}]+)}/g)?.map((p) => p.slice(1, -1)) ?? [];

	if (!sourceFile) {
		console.error(`Could not find source file for ${filePath}`);
		return [];
	}

	for (const methodName of ['GET', 'PUT', 'POST', 'PATCH', 'DELETE']) {
		const functionExpression =
			sourceFile.getFunction(methodName) ??
			sourceFile
				.getVariableDeclaration(methodName)
				?.getInitializerIfKind(SyntaxKind.ArrowFunction) ??
			sourceFile
				.getVariableDeclaration(methodName)
				?.getInitializerIfKind(SyntaxKind.FunctionExpression);

		if (functionExpression) {
			const throwStatements = functionExpression
				.getDescendantsOfKind(SyntaxKind.ThrowStatement)
				.map((throwStatement) => parseThrowStatement(throwStatement))
				.filter((result) => result !== undefined);
			const returnStatements = functionExpression
				.getDescendantsOfKind(SyntaxKind.ReturnStatement)
				.map((returnStatement) => parseReturnStatement(returnStatement))
				.filter((result) => result !== undefined);
			const bodyByStatusAndContentType = [...throwStatements, ...returnStatements].reduce(
				(acc, { body, status, contentType }) => {
					return {
						...acc,
						[status]: {
							...acc[status],
							[contentType]: [...(acc[status]?.[contentType] ?? []), body]
						}
					};
				},
				{} as Record<string, Record<string, OpenAPIV3.SchemaObject[]>>
			);

			endpoints.push({
				path,
				method: methodName.toLowerCase(),
				responses: Object.entries(bodyByStatusAndContentType).reduce(
					(acc, [status, contentTypes]) => {
						return {
							...acc,
							[status]: {
								content: Object.entries(contentTypes).reduce(
									(acc, [contentType, bodies]) => {
										return {
											...acc,
											[contentType]: {
												schema: bodies.length === 1 ? bodies[0] : { oneOf: bodies }
											}
										};
									},
									{} as Record<string, OpenAPIV3.MediaTypeObject>
								),
								description: statusCodes[parseInt(status)] ?? 'No description'
							}
						};
					},
					{} as Record<string, OpenAPIV3.ResponseObject>
				),
				parameters:
					parameters.length === 0
						? undefined
						: parameters.map((name) => ({
								in: 'path',
								name,
								schema: { type: 'string' },
								required: true
							}))
			});
		}
	}

	return endpoints;
};

const isEndpointHandlerPath = (filePath: string) => {
	return filePath.includes('src/routes/api/') && filePath.endsWith('+server.ts');
};

const getEndpointHandlerPath = (filePath: string) => {
	return path
		.relative(import.meta.dirname, filePath)
		.replace(/^src\/routes/, '')
		.replace(/\+server\.ts$/, '')
		.replace(/\[([^\]]+)\]/g, '{$1}');
};

export const sveltekitSwagger = (pluginOptions: PluginOptions): Plugin => {
	const lock = new AwaitLock();
	const options = {
		output: {
			types: path.join(import.meta.dirname, 'src', 'lib', 'swagger', 'types.d.ts'),
			swagger: path.join(import.meta.dirname, 'src', 'lib', 'swagger', 'swagger.json')
		},
		...pluginOptions
	} satisfies MergedOptions;
	const project = createProject(options);

	let endpoints: Endpoint[] = [];

	const writeSwagger = async () => {
		const swagger = createSwagger(options, endpoints);
		const swaggerTypes = await openapiTS(swagger as unknown as OpenAPI3);

		try {
			await lock.acquireAsync();
			await Promise.all([
				fs.writeFile(options.output.types, astToString(swaggerTypes), {
					encoding: 'utf8'
				}),
				fs.writeFile(options.output.swagger, JSON.stringify(swagger, null, 2), {
					encoding: 'utf8'
				})
			]);
		} finally {
			lock.release();
		}
	};

	return {
		name: 'vite-plugin-sveltekit-openapi',
		async buildStart() {
			for (const sourceFile of project.getSourceFiles()) {
				const filePath = sourceFile.getFilePath();

				if (isEndpointHandlerPath(filePath)) {
					endpoints.push(...parseEndpointHandler(project, filePath));
				}
			}

			await writeSwagger();
		},
		async watchChange(id, change) {
			switch (change.event) {
				case 'create': {
					project.addSourceFileAtPath(id);

					if (isEndpointHandlerPath(id)) {
						const path = getEndpointHandlerPath(id);
						endpoints = endpoints.filter((endpoint) => endpoint.path !== path);
						endpoints.push(...parseEndpointHandler(project, id));
						await writeSwagger();
					}
					break;
				}
				case 'update': {
					const sourceFile = project.getSourceFile(id);

					if (sourceFile) {
						const refreshStatus = await sourceFile.refreshFromFileSystem();

						if (isEndpointHandlerPath(id) && refreshStatus === FileSystemRefreshResult.Updated) {
							const path = getEndpointHandlerPath(id);
							endpoints = endpoints.filter((endpoint) => endpoint.path !== path);
							endpoints.push(...parseEndpointHandler(project, id));
							await writeSwagger();
						}
					}
					break;
				}
				case 'delete': {
					const sourceFile = project.getSourceFile(id);
					if (sourceFile) project.removeSourceFile(sourceFile);
					if (isEndpointHandlerPath(id)) {
						const path = getEndpointHandlerPath(id);
						endpoints = endpoints.filter((endpoint) => endpoint.path !== path);
						await writeSwagger();
					}
					break;
				}
			}
		}
	};
};
