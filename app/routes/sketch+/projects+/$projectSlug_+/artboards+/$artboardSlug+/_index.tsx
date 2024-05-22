import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { GeneralErrorBoundary } from '#app/components/error-boundary'
import { getArtboard } from '#app/models/artboard/artboard.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	// https://sergiodxa.com/tutorials/avoid-waterfalls-of-queries-in-remix-loaders
	const { artboardSlug } = params
	const artboard = await getArtboard({
		where: { slug: artboardSlug, ownerId: owner.id },
	})
	invariantResponse(artboard, 'Artboard not found', { status: 404 })

	// simply redirect to main branch, latest version
	// when the artboard path is visited
	const { pathname } = new URL(request.url)
	const redirectPath = `${pathname}/main/latest`

	return redirect(redirectPath)
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
