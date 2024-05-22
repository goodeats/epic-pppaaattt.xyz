import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type BreadcrumbHandle } from '#app/utils/breadcrumbs.tsx'
import { action } from './new-form.server.ts'
import { NewForm } from './new-form.tsx'

export const handle: BreadcrumbHandle = {
	breadcrumb: () => 'New',
}

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export { action }
export default NewForm
