import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { sveltekitSwagger } from './sveltekit-swagger-plugin';

export default defineConfig({
	plugins: [
		sveltekit(),
		sveltekitSwagger({
			swagger: {
				info: {
					title: 'TheDevTest API',
					version: '0.1.0',
					description: 'API documentation for TheDevTest'
				},
				servers: [{ url: 'http://localhost:5173' }, { url: 'https://thedevtest.vercel.app/' }]
			},
			include: ['**/*.ts', '!**/*.test*.ts', '!**/*.svelte*.ts']
		})
	]
});
