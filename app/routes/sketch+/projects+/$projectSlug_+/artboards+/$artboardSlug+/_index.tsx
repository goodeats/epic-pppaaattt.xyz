import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, redirectDocument } from '@remix-run/node'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { getArtboardWithDefaultBranchAndLatestVersion } from '#app/models/artboard/artboard.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects slug artboards slug index route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	// https://sergiodxa.com/tutorials/avoid-waterfalls-of-queries-in-remix-loaders
	const { artboardSlug } = params
	const artboard = await getArtboardWithDefaultBranchAndLatestVersion({
		where: { slug: artboardSlug, ownerId: owner.id },
	})
	invariantResponse(artboard, 'Artboard not found', { status: 404 })

	const branch = artboard.branches[0]
	const version = branch.versions[0]
	const { pathname } = new URL(request.url)
	const redirectPath = `${pathname}/${branch.slug}/${version.slug}`

	// ensure that data is loaded from the route
	// redirect on index.tsx
	// return redirect was working before and now I have to use return redirectDocument
	// otherwise it will just stay on the current page... investigate later if necessary
	return redirectDocument(redirectPath)
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
