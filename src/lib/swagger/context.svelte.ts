import createClient from 'openapi-fetch';
import { getContext, setContext } from 'svelte';

import type { paths } from './types';

const contextKey = Symbol('swagger');
export const getSwaggerContext = () =>
	getContext<{ client: ReturnType<typeof createClient<paths>> }>(contextKey);
export const setSwaggerContext = () => {
	const client = $state(createClient<paths>({ baseUrl: `/api` }));

	return setContext(contextKey, {
		get client() {
			return client;
		}
	});
};
