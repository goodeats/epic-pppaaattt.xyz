import { invariantResponse } from '@epic-web/invariant'
import {
	type LoaderFunctionArgs,
	json,
	type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import {
	Dashboard,
	DashboardBody,
	DashboardContent,
	DashboardContentWrapper,
} from '#app/components/layout'
import { getArtwork } from '#app/models/artwork/artwork.get.server'
import { getArtworkBranch } from '#app/models/artwork-branch/artwork-branch.get.server'
import { getArtworkVersionWithDesignsAndLayers } from '#app/models/artwork-version/artwork-version.get.server'
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
	'routes/sketch+/projects+/$projectSlug_+/artworks+/$artworkSlug+/$branchSlug.$versionSlug'
export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	// https://sergiodxa.com/tutorials/avoid-waterfalls-of-queries-in-remix-loaders
	const artwork = await getArtwork({
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

	const version = await getArtworkVersionWithDesignsAndLayers({ where })
	invariantResponse(version, 'Artwork Version not found', { status: 404 })

	const selectedLayer = version.layers.find(layer => layer.selected)

	const generator = await artworkVersionGeneratorBuildService({ version })

	return json({ version, selectedLayer, generator })
}

export default function SketchProjectArtworkBranchVersionRoute() {
	const data = useLoaderData<typeof loader>()
	const { version, selectedLayer, generator } = data

	// had to consider sidebar from project route level
	// the component names might need re-thinking, but works
	return (
		<Dashboard>
			<ArtworkHeader />
			<DashboardBody id="artwork-editor">
				<SidebarLeft version={version} />
				<DashboardContent>
					<DashboardContentWrapper>
						<CanvasContent generator={generator} />
					</DashboardContentWrapper>
				</DashboardContent>
				<SidebarRight version={version} selectedLayer={selectedLayer} />
			</DashboardBody>
		</Dashboard>
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
			title: `${artworkName} | ${branchName} | ${versionName} | ${projectName} | Sketch | XYZ`,
		},
		{
			name: 'description',
			content: `Sketch dashboard for XYZ artwork project: ${artworkName} (${projectName})`,
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
