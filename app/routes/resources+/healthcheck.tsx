// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import { type LoaderFunctionArgs } from '@remix-run/node'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ request }: LoaderFunctionArgs) {
	console.log('healthcheck beginning...')
	const host =
		request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')

	const url = `${new URL(request.url).protocol}${host}`
	const headers = {
		method: 'HEAD',
		headers: { 'X-Healthcheck': 'true' },
	}
	console.log('healthcheck url', url)

	try {
		// if we can connect to the database and make a simple query
		// and make a HEAD request to ourselves, then we're good.
		await Promise.all([
			prisma.user.count(),
			fetch(url, headers).then(r => {
				if (!r.ok) {
					console.log('healthcheck failed response ❌', { r })
					return Promise.reject(r)
				}
			}),
		])
		console.log('healthcheck passed! ✅')
		return new Response('OK')
	} catch (error: unknown) {
		console.log('healthcheck failed error ❌', { error })
		return new Response('ERROR', { status: 500 })
	}
}
