import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { getArtboardWithDefaultBranchAndLatestVersion } from '#app/models/artboard/artboard.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'

export const artboardLoaderRoute =
	'routes/sketch+/projects+/$projectSlug_+/artboards+/$artboardSlug_+/route'
export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects slug artboards slug route')
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

	return redirect(`${pathname}/${branch.name}/${version.name}`)
}
