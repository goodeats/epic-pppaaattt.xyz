import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { requireUserId } from '#app/utils/auth.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects $slug route')
	await requireUserId(request)
	return json({})
}

export default function SketchProjectRoute() {
	return <Outlet />
}
