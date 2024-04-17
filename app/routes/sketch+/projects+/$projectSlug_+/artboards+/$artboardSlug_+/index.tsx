import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { DashboardContentHeading1 } from '#app/components/layout'
import { getArtboardWithDesignsAndLayers } from '#app/models/artboard/artboard.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects slug artboards index route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	// https://sergiodxa.com/tutorials/avoid-waterfalls-of-queries-in-remix-loaders
	const { artboardSlug } = params
	const artboard = await getArtboardWithDesignsAndLayers({
		where: { slug: artboardSlug, ownerId: owner.id },
	})
	invariantResponse(artboard, 'Artboard not found', { status: 404 })

	return json({ artboard })
}

export default function SketchProjectArtboardsIndexRoute() {
	const data = useLoaderData<typeof loader>()
	const { artboard } = data

	return (
		<div className="container">
			<DashboardContentHeading1>{artboard.name}</DashboardContentHeading1>
		</div>
	)
}
