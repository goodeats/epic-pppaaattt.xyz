import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { DashboardContentHeading1 } from '#app/components/layout'
import { getArtboardWithDesignsAndLayers } from '#app/models/artboard/artboard.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { type loader as projectLoader } from '../../route'

export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects slug artboards index route')
	const userId = await requireUserId(request)
	const owner = await getUserBasic({ where: { id: userId } })
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const { slug } = params
	const artboard = await getArtboardWithDesignsAndLayers({
		where: { slug, ownerId: owner.id },
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

export const meta: MetaFunction<
	typeof loader,
	{ 'routes/sketch+/projects+/$slug_+/route': typeof projectLoader }
> = ({ data, params, matches }) => {
	const artboardName = data?.artboard.name ?? params.slug
	const projectMatch = matches.find(
		m => m.id === 'routes/sketch+/projects+/$slug_+/route',
	)
	console.log('projectMatch', projectMatch)
	// how to get projects loader from projects index route if it gets skipped...
	return [
		{ title: `${artboardName} | Project | Sketchy | XYZ` },
		{
			name: 'description',
			content: `Sketchy dashboard artboards for Project: ${artboardName}`,
		},
	]
}
