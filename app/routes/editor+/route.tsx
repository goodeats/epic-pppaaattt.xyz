import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { Dashboard } from '#app/components/layout'
import { requireUserId } from '#app/utils/auth.server'
import { Header } from './components/header'

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export default function EditorRoute() {
	return (
		<Dashboard>
			<Header />
			<Outlet />
		</Dashboard>
	)
}

export const meta: MetaFunction = () => {
	return [
		{ title: 'Editor | XYZ' },
		{
			name: 'description',
			content: 'Editor dashboard for XYZ',
		},
	]
}
