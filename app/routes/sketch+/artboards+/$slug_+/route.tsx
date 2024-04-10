import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, type MetaFunction } from '@remix-run/react'
import {
	DashboardBody,
	DashboardContent,
} from '#app/components/layout/dashboard.tsx'
import { requireUserId } from '#app/utils/auth.server'
import { redirectWithToast } from '#app/utils/toast.server.ts'
import { action } from './actions/index.ts'
import { CanvasContent } from './components/canvas-content'
import { SidebarLeft, SidebarRight } from './components/sidebars'
import {
	getArtboard,
	getArtboardGenerator,
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
				description: `You may have deleted it while it was being viewed.`,
			})
		}

		layerDesigns = await getLayerDesigns({ layer })
	}

	const layers = await getLayers({ userId, artboardId: artboard.id })

	const artboardDesigns = await getArtboardDesigns({ artboard })

	const artboardGenerator = await getArtboardGenerator(artboard, layers)

	return json({
		owner,
		artboard,
		artboardDesigns,
		layer,
		layerDesigns,
		layers,
		artboardGenerator,
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
		artboardGenerator,
	} = data
	console.log('artboardGenerator', artboardGenerator.message)

	return (
		<DashboardBody id="sketch-dashboard-body">
			<SidebarLeft artboard={artboard} layers={layers} />
			<DashboardContent id="sketch-dashboard-content">
				<CanvasContent
					artboard={artboard}
					artboardGenerator={artboardGenerator}
				/>
			</DashboardContent>
			<SidebarRight
				artboard={artboard}
				artboardDesigns={artboardDesigns}
				layer={layer}
				layerDesigns={layerDesigns}
			/>
		</DashboardBody>
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
