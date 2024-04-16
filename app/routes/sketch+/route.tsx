import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { Dashboard } from '#app/components/layout'
import { requireUserId } from '#app/utils/auth.server'
import { Header } from './components/header'

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	console.log('sketch+ route')
	return json({})
}

export default function SketchRoute() {
	return (
		<Dashboard id="sketch-dashboard">
			<Header />
			<Outlet />
		</Dashboard>
	)
}
