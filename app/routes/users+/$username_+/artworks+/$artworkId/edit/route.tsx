import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { type MetaFunction, useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type BreadcrumbHandle } from '#app/utils/breadcrumbs.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { type loader as artworksLoader } from '../../route.tsx'
import { action } from './edit-form.server.ts'
import { EditForm } from './edit-form.tsx'

export { action }

export const handle: BreadcrumbHandle = {
	breadcrumb: () => 'Edit',
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const artwork = await prisma.artwork.findFirst({
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
			slug: params.artworkId,
			ownerId: userId,
		},
	})
	invariantResponse(artwork, 'Not found', { status: 404 })
	return json({ artwork: artwork, project: artwork.project })
}

export default function ArtworkEdit() {
	const data = useLoaderData<typeof loader>()

	return <EditForm artwork={data.artwork} />
}

export const meta: MetaFunction<
	typeof loader,
	{ 'routes/users+/$username_+/artworks': typeof artworksLoader }
> = ({ data, params, matches }) => {
	const metaMatch = matches.find(
		m => m.id === 'routes/users+/$username_+/artworks',
	)
	const displayName = metaMatch?.data?.owner.name ?? params.username
	const entityTitle = data?.artwork.name ?? 'Artwork'
	const entityDescriptionSummary =
		data?.artwork.description && data.artwork.description.length > 100
			? data.artwork.description.slice(0, 97) + '...'
			: data?.artwork.description || 'No description'
	return [
		{ title: `Edit ${entityTitle} | ${displayName}'s Artworks | XYZ` },
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
					<p>No artwork with the id "{params.artworkId}" exists</p>
				),
			}}
		/>
	)
}
