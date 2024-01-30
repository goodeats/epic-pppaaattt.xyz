import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type BreadcrumbHandle } from '#app/utils/breadcrumbs.tsx'
import { AssignAppearancesForm, action } from './assign-form.jsx'
import { getAppearances, getArtboard } from './queries.ts'

export const handle: BreadcrumbHandle = {
	breadcrumb: () => 'Assign',
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const artboard = await getArtboard(userId, params.artboardId as string)
	const appearances = await getAppearances(userId)

	invariantResponse(artboard, 'Not found', { status: 404 })
	return json({ artboard, appearances })
}

export { action }
export default AssignAppearancesForm
