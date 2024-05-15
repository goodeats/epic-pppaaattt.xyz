import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import {
	Dashboard,
	DashboardBody,
	DashboardContent,
	DashboardContentWrapper,
} from '#app/components/layout'
import { getArtboard } from '#app/models/artboard/artboard.get.server'
import { getArtboardBranch } from '#app/models/artboard-branch/artboard-branch.get.server'
import { getArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { artboardVersionGeneratorBuildService } from '#app/services/artboard/version/generator/build.service'
import { requireUserId } from '#app/utils/auth.server'
import { CanvasContent } from './__components/canvas-content'
import { ArtboardHeader } from './__components/header.artboard'
import { SidebarLeft, SidebarRight } from './__components/sidebars'

export const artboardVersionLoaderRoute =
	'routes/sketch+/projects+/$projectSlug_+/artboards+/$artboardSlug+/$branchSlug.$versionSlug'
export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects slug artboards slug branch version route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	// https://sergiodxa.com/tutorials/avoid-waterfalls-of-queries-in-remix-loaders
	const artboard = await getArtboard({
		where: { slug: params.artboardSlug, ownerId: owner.id },
	})
	invariantResponse(artboard, 'Artboard not found', { status: 404 })

	const branch = await getArtboardBranch({
		where: { artboardId: artboard.id, slug: params.branchSlug },
	})
	invariantResponse(branch, 'Artboard Branch not found', { status: 404 })

	const { versionSlug } = params
	const where =
		versionSlug === 'latest'
			? { ownerId: owner.id, branchId: branch.id, nextId: null }
			: { ownerId: owner.id, branchId: branch.id, slug: versionSlug }

	const version = await getArtboardVersionWithDesignsAndLayers({ where })
	invariantResponse(version, 'Artboard Version not found', { status: 404 })

	const selectedLayer = version.layers.find(layer => layer.selected)

	const generator = await artboardVersionGeneratorBuildService({ version })

	return json({ version, selectedLayer, generator })
}

export default function SketchProjectArtboardBranchVersionRoute() {
	const data = useLoaderData<typeof loader>()
	const { version, selectedLayer, generator } = data

	console.log('reloaded')

	// had to consider sidebar from project route level
	// the component names might need re-thinking, but works
	return (
		<Dashboard>
			<ArtboardHeader />
			<DashboardBody id="artboard-editor">
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
