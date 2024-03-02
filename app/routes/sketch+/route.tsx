import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { requireUserId } from '#app/utils/auth.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export default function SketchRoute() {
	return <Outlet />
}
