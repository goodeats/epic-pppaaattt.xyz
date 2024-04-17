import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { getArtboardBranchWithVersions } from '#app/models/artboard-branch/artboard-branch.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'

export const artboardBranchLoaderRoute =
	'routes/sketch+/projects+/$projectSlug_+/artboards+/$artboardSlug_+/$branchSlug_+/route'
export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects slug artboards slug branch route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	// https://sergiodxa.com/tutorials/avoid-waterfalls-of-queries-in-remix-loaders
	const { branchSlug } = params
	const branch = await getArtboardBranchWithVersions({
		where: { slug: branchSlug, ownerId: owner.id },
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
