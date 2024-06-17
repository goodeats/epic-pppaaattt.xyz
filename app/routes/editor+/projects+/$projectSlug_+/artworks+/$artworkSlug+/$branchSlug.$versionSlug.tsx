import { invariantResponse } from '@epic-web/invariant'
import {
	type LoaderFunctionArgs,
	json,
	type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import {
	DashboardContent,
	DashboardContentWrapper,
	FlexColumn,
	FlexRow,
} from '#app/components/layout'
import { getArtworkWithAssets } from '#app/models/artwork/artwork.get.server'
import { getArtworkBranch } from '#app/models/artwork-branch/artwork-branch.get.server'
import { getArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { artworkVersionGeneratorBuildService } from '#app/services/artwork/version/generator/build.service'
import { requireUserId } from '#app/utils/auth.server'
import { routeLoaderMetaData } from '#app/utils/matches'
import { projectLoaderRoute } from '../route'
import { artworkBranchLoaderRoute } from './$branchSlug'
import { CanvasContent } from './__components/canvas-content'
import { ArtworkHeader } from './__components/header.artwork'
import { SidebarLeft, SidebarRight } from './__components/sidebars'
import { artworkLoaderRoute } from './route'

export const artworkVersionLoaderRoute =
	'routes/editor+/projects+/$projectSlug_+/artworks+/$artworkSlug+/$branchSlug.$versionSlug'
export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	// https://sergiodxa.com/tutorials/avoid-waterfalls-of-queries-in-remix-loaders
	const artwork = await getArtworkWithAssets({
		where: { slug: params.artworkSlug, ownerId: owner.id },
	})
	invariantResponse(artwork, 'Artwork not found', { status: 404 })

	const branch = await getArtworkBranch({
		where: { artworkId: artwork.id, slug: params.branchSlug },
	})
	invariantResponse(branch, 'Artwork Branch not found', { status: 404 })

	const { versionSlug } = params
	const where =
		versionSlug === 'latest'
			? { ownerId: owner.id, branchId: branch.id, nextId: null }
			: { ownerId: owner.id, branchId: branch.id, slug: versionSlug }

	const version = await getArtworkVersionWithChildren({ where })
	invariantResponse(version, 'Artwork Version not found', { status: 404 })

	const selectedLayer = version.layers.find(layer => layer.selected)

	const generator = await artworkVersionGeneratorBuildService({ version })

	return json({ artwork, version, selectedLayer, generator })
}

export default function EditorProjectArtworkBranchVersionRoute() {
	const data = useLoaderData<typeof loader>()
	const { version, selectedLayer, generator } = data

	return (
		<FlexColumn className="flex-1 gap-3 rounded-md bg-accent p-4">
			<ArtworkHeader />
			<FlexRow className="flex-1 rounded-md border">
				<SidebarLeft version={version} />
				<DashboardContent className="border">
					<DashboardContentWrapper>
						<CanvasContent generator={generator} />
					</DashboardContentWrapper>
				</DashboardContent>
				<SidebarRight version={version} selectedLayer={selectedLayer} />
			</FlexRow>
		</FlexColumn>
	)
}

export const meta: MetaFunction<typeof loader> = ({ params, matches }) => {
	const projectData = routeLoaderMetaData(matches, projectLoaderRoute)
	const projectName = projectData?.project.name ?? params.projectSlug

	const artworkData = routeLoaderMetaData(matches, artworkLoaderRoute)
	const artworkName = artworkData?.artwork.name ?? params.artworkSlug

	const branchData = routeLoaderMetaData(matches, artworkBranchLoaderRoute)
	const branchName = branchData?.branch.name ?? params.branchSlug

	const versionData = routeLoaderMetaData(matches, artworkVersionLoaderRoute)
	const versionName = versionData?.version.name ?? params.versionSlug

	return [
		{
			title: `${artworkName} | ${branchName} | ${versionName} | ${projectName} | Editor | XYZ`,
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
					return <p>No version with the name "{params.versionSlug}" exists</p>
				},
			}}
		/>
	)
}
