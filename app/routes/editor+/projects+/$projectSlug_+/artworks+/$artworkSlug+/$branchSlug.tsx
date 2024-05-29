import { invariantResponse } from '@epic-web/invariant'
import {
	type LoaderFunctionArgs,
	json,
	type MetaFunction,
} from '@remix-run/node'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { getArtwork } from '#app/models/artwork/artwork.get.server'
import { getArtworkBranchWithVersions } from '#app/models/artwork-branch/artwork-branch.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { routeLoaderMetaData } from '#app/utils/matches'
import { projectLoaderRoute } from '../route'
import { artworkLoaderRoute } from './route'

export const artworkBranchLoaderRoute =
	'routes/editor+/projects+/$projectSlug_+/artworks+/$artworkSlug+/$branchSlug'
export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	// https://sergiodxa.com/tutorials/avoid-waterfalls-of-queries-in-remix-loaders
	const artwork = await getArtwork({
		where: { slug: params.artworkSlug, ownerId: owner.id },
	})
	invariantResponse(artwork, 'Artwork not found', { status: 404 })

	const branch = await getArtworkBranchWithVersions({
		where: { artworkId: artwork.id, slug: params.branchSlug },
	})
	invariantResponse(branch, 'Artwork Branch not found', { status: 404 })

	// ensure that data is loaded from the route
	// redirect on index.tsx
	return json({ branch })
}

export const meta: MetaFunction<typeof loader> = ({ params, matches }) => {
	const projectData = routeLoaderMetaData(matches, projectLoaderRoute)
	const projectName = projectData?.project.name ?? params.projectSlug

	const artworkData = routeLoaderMetaData(matches, artworkLoaderRoute)
	const artworkName = artworkData?.artwork.name ?? params.artworkSlug

	const branchData = routeLoaderMetaData(matches, artworkBranchLoaderRoute)
	const branchName = branchData?.branch.name ?? params.branchSlug
	return [
		{
			title: `${artworkName} | ${branchName} | ${projectName} | Editor | XYZ`,
		},
		{
			name: 'description',
			content: `Editor dashboard for XYZ artwork project: ${artworkName} (${projectName})`,
		},
	]
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => {
					return <p>No branch with the name "{params.branchSlug}" exists</p>
				},
			}}
		/>
	)
}
