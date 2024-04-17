import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type MetaFunction,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { getArtboardWithDesignsAndLayers } from '#app/models/artboard/artboard.get.server'
import { getUserBasic } from '#app/models/user/user.get.server'
import { requireUserId } from '#app/utils/auth.server'
import { routeLoaderMetaData } from '#app/utils/matches'
import { projectLoaderRoute } from '../route'

export const artboardLoaderRoute =
	'routes/sketch+/projects+/$projectSlug_+/artboards+/$artboardSlug_+/route'
export async function loader({ params, request }: LoaderFunctionArgs) {
	console.log('sketch+ projects slug artboards slug route')
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

export default function SketchProjectArtboardsRoute() {
	return <Outlet />
}

export const meta: MetaFunction<typeof loader> = ({ params, matches }) => {
	const projectData = routeLoaderMetaData(matches, projectLoaderRoute)
	const projectName = projectData?.project?.name ?? 'Project'
	const artboardData = routeLoaderMetaData(matches, artboardLoaderRoute)
	const artboardName = artboardData?.artboard.name ?? params.slug
	return [
		{ title: `${artboardName} | ${projectName} | Sketchy | XYZ` },
		{
			name: 'description',
			content: `Sketchy dashboard artboards for Project: ${artboardName}`,
		},
	]
}
