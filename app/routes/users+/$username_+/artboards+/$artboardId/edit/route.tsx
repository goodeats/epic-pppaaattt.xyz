import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { type MetaFunction, useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type BreadcrumbHandle } from '#app/utils/breadcrumbs.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { type loader as artboardsLoader } from '../../route.tsx'
import { EditForm, action } from './edit-form.tsx'

export { action }

export const handle: BreadcrumbHandle = {
	breadcrumb: () => 'Edit',
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const artboard = await prisma.artboard.findFirst({
		select: {
			id: true,
			name: true,
			description: true,
			isVisible: true,
			width: true,
			height: true,
			backgroundColor: true,
			project: {
				select: {
					name: true,
					description: true,
					isVisible: true,
					slug: true,
					updatedAt: true,
				},
			},
		},
		where: {
			slug: params.artboardId,
			ownerId: userId,
		},
	})
	invariantResponse(artboard, 'Not found', { status: 404 })
	return json({ artboard: artboard, project: artboard.project })
}

export default function ArtboardEdit() {
	const data = useLoaderData<typeof loader>()

	return <EditForm artboard={data.artboard} />
}

export const meta: MetaFunction<
	typeof loader,
	{ 'routes/users+/$username_+/artboards': typeof artboardsLoader }
> = ({ data, params, matches }) => {
	const metaMatch = matches.find(
		m => m.id === 'routes/users+/$username_+/artboards',
	)
	const displayName = metaMatch?.data?.owner.name ?? params.username
	const entityTitle = data?.artboard.name ?? 'Artboard'
	const entityDescriptionSummary =
		data?.artboard.description && data.artboard.description.length > 100
			? data.artboard.description.slice(0, 97) + '...'
			: data?.artboard.description || 'No description'
	return [
		{ title: `Edit ${entityTitle} | ${displayName}'s Artboards | XYZ` },
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
					<p>No artboard with the id "{params.artboardId}" exists</p>
				),
			}}
		/>
	)
}
