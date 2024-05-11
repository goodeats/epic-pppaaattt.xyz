import { vitePlugin as remix } from '@remix-run/dev'
import { flatRoutes } from 'remix-flat-routes'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		remix({
			ignoredRouteFiles: ['**/*'],
			serverModuleFormat: 'esm',
			routes: async defineRoutes => {
				return flatRoutes('routes', defineRoutes, {
					ignoredRouteFiles: [
						'.*',
						'**/*.css',
						'**/*.test.{js,jsx,ts,tsx}',
						'**/__*.*',
					],
				})
			},
		}),
	],
})
