import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { getArtboardVersion } from '#app/models/artboard-version/artboard-version.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { CanvasContent } from './components/canvas-content'

export const artboardBranchVersionLoaderRoute =
	'routes/sketch+/projects+/$projectSlug_+/artboards+/$artboardSlug_+/$branchSlug_+/$versionSlug_+/route'
export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects slug artboards slug branch version route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	// https://sergiodxa.com/tutorials/avoid-waterfalls-of-queries-in-remix-loaders
	const { versionSlug } = params
	const version = await getArtboardVersion({
		where: { slug: versionSlug, ownerId: owner.id },
	})
	invariantResponse(version, 'Artboard Version not found', { status: 404 })

	const { pathname } = new URL(request.url)
	console.log('pathname', pathname)

	console.log('no redirect...')
	return json({ version })
}

export default function SketchProjectArtboardBranchRoute() {
	const data = useLoaderData<typeof loader>()
	const { version } = data

	return (
		<div>
			<CanvasContent version={version} artboardGenerator={null} />
		</div>
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
