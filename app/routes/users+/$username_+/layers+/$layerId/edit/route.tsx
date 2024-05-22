import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { type MetaFunction, useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type BreadcrumbHandle } from '#app/utils/breadcrumbs.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { type loader as layersLoader } from '../../route.tsx'
import { action } from './edit-form.server.ts'
import { EditForm } from './edit-form.tsx'

export { action }

export const handle: BreadcrumbHandle = {
	breadcrumb: () => 'Edit',
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const layer = await prisma.layer.findFirst({
		select: {
			id: true,
			name: true,
			description: true,
		},
		where: {
			slug: params.layerId,
			ownerId: userId,
		},
	})
	invariantResponse(layer, 'Not found', { status: 404 })
	return json({ layer: layer })
}

export default function LayerEdit() {
	const data = useLoaderData<typeof loader>()

	return <EditForm layer={data.layer} />
}

export const meta: MetaFunction<
	typeof loader,
	{ 'routes/users+/$username_+/layers': typeof layersLoader }
> = ({ data, params, matches }) => {
	const entitiessMatch = matches.find(
		m => m.id === 'routes/users+/$username_+/layers',
	)
	const displayName = entitiessMatch?.data?.owner.name ?? params.username
	const entityTitle = data?.layer.name ?? 'Layer'
	const entityDescriptionSummary =
		data?.layer.description && data.layer.description.length > 100
			? data.layer.description.slice(0, 97) + '...'
			: data?.layer.description || 'No description'
	return [
		{ title: `Edit ${entityTitle} | ${displayName}'s Layers | XYZ` },
		{
			name: 'description',
			content: entityDescriptionSummary,
		},
	]
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No layer with the id "{params.layerId}" exists</p>
				),
			}}
		/>
	)
}
