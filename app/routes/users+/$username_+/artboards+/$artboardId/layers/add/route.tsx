import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type BreadcrumbHandle } from '#app/utils/breadcrumbs.tsx'
import { AddLayerForm, action } from './add-form.tsx'
import { getArtboard, getLayers } from './queries.ts'

export const handle: BreadcrumbHandle = {
	breadcrumb: () => 'New',
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const artboard = await getArtboard(userId, params.artboardId as string)
	const layers = await getLayers(userId)

	invariantResponse(artboard, 'Not found', { status: 404 })
	return json({ artboard, layers })
}

export { action }
export default AddLayerForm
