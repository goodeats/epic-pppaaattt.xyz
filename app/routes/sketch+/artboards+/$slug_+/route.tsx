import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import { Sidebar, SketchBody, SketchBodyContent } from '#app/components/shared'
import { requireUserId } from '#app/utils/auth.server'
import { redirectWithToast } from '#app/utils/toast.server.ts'
import { action } from './actions/index.ts'
import { CanvasContent } from './components/canvas-content'
import { PanelContentLeft, PanelContentRight } from './components/panel-content'
import {
	getArtboard,
	getArtboardBuild,
	getArtboardDesigns,
	getLayer,
	getLayerDesigns,
	getLayers,
	getOwner,
} from './queries'

export { action }

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getOwner(userId)
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const { slug } = params
	const artboard = await getArtboard(userId, slug as string)
	invariantResponse(artboard, 'Artboard not found', { status: 404 })

	const url = new URL(request.url)
	const { pathname, searchParams } = url
	const layerId = searchParams.get('layerId')
	let layer,
		layerDesigns = null
	if (layerId) {
		layer = await getLayer({ layerId, userId, artboardId: artboard.id })
		if (!layer) {
			return redirectWithToast(pathname, {
				title: 'Layer Not Found',
				description: `You may have deleted it.`,
			})
		}

		layerDesigns = await getLayerDesigns({ layer })
	}

	const date = new Date(artboard.updatedAt)
	const artboardTimeAgo = formatDistanceToNow(date)

	const layers = await getLayers({ userId, artboardId: artboard.id })

	const artboardDesigns = await getArtboardDesigns({ artboard })

	const artboardBuild = await getArtboardBuild(artboard, layers)

	return json({
		owner,
		artboard,
		artboardTimeAgo,
		artboardDesigns,
		layer,
		layerDesigns,
		layers,
		artboardBuild,
	})
}

export default function SketchRoute() {
	const data = useLoaderData<typeof loader>()
	const {
		artboard,
		artboardDesigns,
		layer,
		layerDesigns,
		layers,
		artboardBuild,
	} = data

	return (
		<SketchBody>
			<Sidebar id="sidebar-left">
				<PanelContentLeft artboard={artboard} layers={layers} />
			</Sidebar>
			<SketchBodyContent>
				<CanvasContent artboard={artboard} artboardBuild={artboardBuild} />
			</SketchBodyContent>
			<Sidebar id="sidebar-right">
				<PanelContentRight
					artboard={artboard}
					artboardDesigns={artboardDesigns}
					layer={layer}
					layerDesigns={layerDesigns}
				/>
			</Sidebar>
		</SketchBody>
	)
}

export const meta: MetaFunction<
	null,
	{ 'routes/sketch+/artboards+/$slug_+/route': typeof loader }
> = ({ matches }) => {
	const routeMatch = matches.find(
		m => m.id === 'routes/sketch+/artboards+/$slug_+/route',
	)
	const descriptionEntity = 'Sketch'
	const entityTitle = routeMatch?.data?.artboard.name ?? 'Artboard'

	return [
		{ title: `${entityTitle} | Sketch` },
		{
			name: 'description',
			content: `Checkout ${descriptionEntity} on PPPAAATTT.XYZ`,
		},
	]
}
