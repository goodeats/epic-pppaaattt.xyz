import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { getArtboardWithBranchesAndVersions } from '#app/models/artboard/artboard.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'

// starting the flat routes here in this directory
// since the artboard will redirect to the branch and version route
// there could be more added to the parent routes on their pages

// the value of the flat routes appears to be in the IDE
// where there are numerous nested folders
// that make it more challenging to know which is the file you're looking for

// super awesome routing vizualizer
// https://interactive-remix-routing-v2.netlify.app/
// docs: https://remix.run/docs/en/main/file-conventions/routes

export const artboardLoaderRoute =
	'routes/sketch+/projects+/$projectSlug_+/artboards+/$artboardSlug+/route'
export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects slug artboards slug route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	// https://sergiodxa.com/tutorials/avoid-waterfalls-of-queries-in-remix-loaders
	const artboard = await getArtboardWithBranchesAndVersions({
		where: { slug: params.artboardSlug, ownerId: owner.id },
	})
	invariantResponse(artboard, 'Artboard not found', { status: 404 })

	// ensure that data is loaded from the route
	// redirect on index.tsx
	return json({ artboard })
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No artboard with the name "{params.artboardSlug}" exists</p>
				),
			}}
		/>
	)
}
