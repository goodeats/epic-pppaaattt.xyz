import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { getArtwork } from '#app/models/artwork/artwork.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	// https://sergiodxa.com/tutorials/avoid-waterfalls-of-queries-in-remix-loaders
	const { artworkSlug } = params
	const artwork = await getArtwork({
		where: { slug: artworkSlug, ownerId: owner.id },
	})
	invariantResponse(artwork, 'Artwork not found', { status: 404 })

	// simply redirect to main branch, latest version
	// when the artwork path is visited
	const { pathname } = new URL(request.url)
	const redirectPath = `${pathname}/main/latest`

	return redirect(redirectPath)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No artwork with the name "{params.artworkSlug}" exists</p>
				),
			}}
		/>
	)
}
