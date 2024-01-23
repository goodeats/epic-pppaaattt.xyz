import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server.ts'
import { ProjectEditor, action } from './new-project-form.tsx'

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export { action }
export default ProjectEditor
