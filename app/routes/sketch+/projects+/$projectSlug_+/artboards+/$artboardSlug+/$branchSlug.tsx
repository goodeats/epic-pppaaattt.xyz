import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { getArtboard } from '#app/models/artboard/artboard.get.server'
import { getArtboardBranchWithVersions } from '#app/models/artboard-branch/artboard-branch.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'

export const artboardBranchLoaderRoute =
	'routes/sketch+/projects+/$projectSlug_+/artboards+/$artboardSlug+/$branchSlug'
export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects slug artboards slug branch route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	// https://sergiodxa.com/tutorials/avoid-waterfalls-of-queries-in-remix-loaders
	const artboard = await getArtboard({
		where: { slug: params.artboardSlug, ownerId: owner.id },
	})
	invariantResponse(artboard, 'Artboard not found', { status: 404 })

	const branch = await getArtboardBranchWithVersions({
		where: { artboardId: artboard.id, slug: params.branchSlug },
	})
	invariantResponse(branch, 'Artboard Branch not found', { status: 404 })

	// ensure that data is loaded from the route
	// redirect on index.tsx
	return json({ branch })
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
