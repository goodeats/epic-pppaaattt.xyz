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
import { routeLoaderData } from '#app/utils/meta'
import { projectLoaderRoute } from '../../route'
import { artboardLoaderRoute } from './route'

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

export const meta: MetaFunction<typeof loader> = ({ params, matches }) => {
	const projectData = routeLoaderData(matches, projectLoaderRoute)
	const projectName = projectData?.project?.name ?? 'Project'
	const artboardData = routeLoaderData(matches, artboardLoaderRoute)
	const artboardName = artboardData?.artboard.name ?? params.slug
	return [
		{ title: `${artboardName} | ${projectName} | Sketchy | XYZ` },
		{
			name: 'description',
			content: `Sketchy dashboard artboards for Project: ${artboardName}`,
		},
	]
}
