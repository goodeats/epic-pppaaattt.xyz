import { parse } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import {
	type LoaderFunctionArgs,
	json,
	type ActionFunctionArgs,
} from '@remix-run/node'
import { type MetaFunction, useLoaderData } from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { ContainerDetails } from '#app/components/shared/container.tsx'
import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator.ts'
import { getStarredArtworkVersionsByArtworkId } from '#app/models/artwork-version/artwork-version.get.server.ts'
import {
	type IArtworkVersionWithGenerator,
	type IArtworkVersionWithDesignsAndLayers,
} from '#app/models/artwork-version/artwork-version.server.ts'
import { artworkVersionGeneratorBuildService } from '#app/services/artwork/version/generator/build.service.ts'
import { requireUserId } from '#app/utils/auth.server'
import { validateCSRF } from '#app/utils/csrf.server'
import { prisma } from '#app/utils/db.server'
import { requireUserWithPermission } from '#app/utils/permissions.server.ts'
import { redirectWithToast } from '#app/utils/toast.server'
import { userHasPermission, useOptionalUser } from '#app/utils/user'
import { type loader as artworksLoader } from '../../route.tsx'
import { Content, Footer, Header } from './components.tsx'
import { getArtwork } from './queries.ts'
import { StarredVersions } from './starred-versions.tsx'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const artwork = await getArtwork(userId, params.artworkId as string)
	invariantResponse(artwork, 'Not found', { status: 404 })

	// get all starred versions for this artwork
	const starredVersions: IArtworkVersionWithDesignsAndLayers[] =
		await getStarredArtworkVersionsByArtworkId({
			artworkId: artwork.id,
		})

	// get all generators for these versions
	const generators: IArtworkVersionGenerator[] = await Promise.all(
		starredVersions.map(version =>
			artworkVersionGeneratorBuildService({ version }),
		),
	)

	// combine versions and generators
	const versionsWithGenerators: IArtworkVersionWithGenerator[] =
		starredVersions.map((version, index) => ({
			...version,
			generator: generators[index],
		}))

	const date = new Date(artwork.updatedAt)
	const timeAgo = formatDistanceToNow(date)

	return json({
		artwork,
		versionsWithGenerators,
		timeAgo,
		breadcrumb: artwork.name,
		project: artwork.project,
	})
}

const DeleteFormSchema = z.object({
	intent: z.literal('delete-artwork'),
	artworkId: z.string(),
})

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	await validateCSRF(formData, request.headers)
	const submission = parse(formData, {
		schema: DeleteFormSchema,
	})
	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}
	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const { artworkId } = submission.value

	const artwork = await prisma.artwork.findFirst({
		select: {
			id: true,
			name: true,
			ownerId: true,
			owner: {
				select: { username: true },
			},
			project: {
				select: {
					slug: true,
				},
			},
		},
		where: { id: artworkId },
	})
	invariantResponse(artwork, 'Not found', { status: 404 })

	const { id, name, owner, ownerId, project } = artwork

	const isOwner = ownerId === userId
	await requireUserWithPermission(
		request,
		isOwner ? `delete:artwork:own` : `delete:artwork:any`,
	)

	await prisma.artwork.delete({ where: { id: id } })

	return redirectWithToast(
		`/users/${owner.username}/projects/${project.slug}`,
		{
			type: 'success',
			title: 'Success',
			description: `Deleted artwork: "${name}"`,
		},
	)
}

export default function ArtworkDetailsRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isOwner = user?.id === data.artwork.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:artwork:own` : `delete:artwork:any`,
	)
	const displayBar = canDelete || isOwner

	return (
		<ContainerDetails>
			<Header />
			<Content />
			<StarredVersions versions={data.versionsWithGenerators} />
			{displayBar ? <Footer /> : null}
		</ContainerDetails>
	)
}

export const meta: MetaFunction<
	typeof loader,
	{ 'routes/users+/$username_+/artworks': typeof artworksLoader }
> = ({ data, params, matches }) => {
	const artworkssMatch = matches.find(
		m => m.id === 'routes/users+/$username_+/artworks',
	)
	const displayName = artworkssMatch?.data?.owner.name ?? params.username
	const entityTitle = data?.artwork.name ?? 'Artwork'
	const entityDescriptionSummary =
		data?.artwork.description && data.artwork.description.length > 100
			? data.artwork.description.slice(0, 97) + '...'
			: data?.artwork.description || 'No description'
	return [
		{ title: `${entityTitle} | ${displayName}'s Artworks | XYZ` },
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
				403: () => <p>You are not allowed to do that</p>,
				404: ({ params }) => (
					<p>No artwork with the name "{params.artworkId}" exists</p>
				),
			}}
		/>
	)
}
