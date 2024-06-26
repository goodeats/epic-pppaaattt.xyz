import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { getArtworkBranchWithVersions } from '#app/models/artwork-branch/artwork-branch.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'

export const artworkBranchLoaderRoute =
	'routes/editor+/projects+/$projectSlug_+/artworks+/$artworkSlug_+/$branchSlug_+/route'
export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	// https://sergiodxa.com/tutorials/avoid-waterfalls-of-queries-in-remix-loaders
	const { branchSlug } = params
	const branch = await getArtworkBranchWithVersions({
		where: { slug: branchSlug, ownerId: owner.id },
	})
	invariantResponse(branch, 'Artwork Branch not found', { status: 404 })

	// simply redirect to latest version
	// when the branch path is visited
	const { pathname } = new URL(request.url)
	const redirectPath = `${pathname}/latest`

	// ensure that data is loaded from the route
	// redirect on index.tsx
	return redirect(redirectPath)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => {
					return (
						<p>No artwork branch with the name "{params.branchSlug}" exists</p>
					)
				},
			}}
		/>
	)
}
