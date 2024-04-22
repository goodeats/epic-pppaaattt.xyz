import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import {
	DashboardBody,
	DashboardContent,
	DashboardContentWrapper,
} from '#app/components/layout'
import { getArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { artboardVersionGeneratorBuildService } from '#app/services/artboard/version/generator/build.service'
import { requireUserId } from '#app/utils/auth.server'
import { CanvasContent } from './__components/canvas-content'
import { SidebarLeft, SidebarRight } from './__components/sidebars'

export const artboardVersionLoaderRoute =
	'routes/sketch+/projects+/$projectSlug_+/artboards+/$artboardSlug_+/$branchSlug_+/$versionSlug_+/route'
export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects slug artboards slug branch version route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	// https://sergiodxa.com/tutorials/avoid-waterfalls-of-queries-in-remix-loaders
	const { versionSlug } = params
	const version = await getArtboardVersionWithDesignsAndLayers({
		where: { slug: versionSlug, ownerId: owner.id },
	})
	invariantResponse(version, 'Artboard Version not found', { status: 404 })

	const generator = await artboardVersionGeneratorBuildService({ version })

	return json({ version, generator })
}

export default function SketchProjectArtboardBranchRoute() {
	const data = useLoaderData<typeof loader>()
	const { version, generator } = data

	// had to consider sidebar from project route level
	// the component names might need re-thinking, but works
	return (
		<DashboardContentWrapper>
			<DashboardBody id="artboard-editor">
				<SidebarLeft version={version} />
				<DashboardContent>
					<CanvasContent generator={generator} />
				</DashboardContent>
				<SidebarRight version={version} />
			</DashboardBody>
		</DashboardContentWrapper>
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
