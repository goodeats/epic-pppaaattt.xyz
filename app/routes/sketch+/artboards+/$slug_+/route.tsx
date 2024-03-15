import { invariantResponse } from '@epic-web/invariant'
import {
	type DataFunctionArgs,
	json,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import {
	PanelContainer,
	SketchBody,
	SketchBodyContent,
} from '#app/components/shared'
import { findManyDesignsWithType } from '#app/models/design.server'
import { findManyLayers } from '#app/models/layer.server'
import { requireUserId } from '#app/utils/auth.server'
import { validateCSRF } from '#app/utils/csrf.server'
import {
	artboardDesignDeleteAction,
	artboardDesignNewAction,
	artboardDesignReorderAction,
	artboardDesignToggleVisibilityAction,
} from './actions/artboard-design'
import {
	artboardDesignEditFillAction,
	artboardDesignEditFillBasisAction,
	artboardDesignEditFillStyleAction,
	artboardDesignNewFillAction,
} from './actions/artboard-design-fill'
import {
	artboardDesignEditLayoutColumnsAction,
	artboardDesignEditLayoutCountAction,
	artboardDesignEditLayoutRowsAction,
	artboardDesignEditLayoutStyleAction,
	artboardDesignNewLayoutAction,
} from './actions/artboard-design-layout'
import {
	artboardDesignEditLineWidthAction,
	artboardDesignNewLineAction,
} from './actions/artboard-design-line'
import { artboardDesignEditPaletteAction } from './actions/artboard-design-palette'
import {
	artboardDesignEditRotateAction,
	artboardDesignEditRotateBasisAction,
	artboardDesignNewRotateAction,
} from './actions/artboard-design-rotate'
import {
	artboardDesignEditSizeAction,
	artboardDesignNewSizeAction,
} from './actions/artboard-design-size'
import {
	artboardDesignEditStrokeAction,
	artboardDesignEditStrokeBasisAction,
	artboardDesignEditStrokeStyleAction,
	artboardDesignNewStrokeAction,
} from './actions/artboard-design-stroke'
import {
	artboardDesignEditTemplateStyleAction,
	artboardDesignNewTemplateAction,
} from './actions/artboard-design-template'
import {
	artboardLayerDeleteAction,
	artboardLayerNewAction,
	artboardLayerReorderAction,
	artboardLayerToggleVisibilityAction,
	artboardLayerUpdateDescriptionAction,
	artboardLayerUpdateNameAction,
} from './actions/artboard-layer'
import {
	artboardUpdateBackgroundColorAction,
	artboardUpdateHeightAction,
	artboardUpdateWidthAction,
} from './actions/update-artboard'
import { CanvasContent } from './components/canvas-content'
import { PanelContentLeft, PanelContentRight } from './components/panel-content'
import { INTENT } from './intent'
import { getArtboard, getArtboardBuild, getOwner } from './queries'

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	await validateCSRF(formData, request.headers)

	const actionArgs = { request, userId, formData }
	const intent = formData.get('intent')
	switch (intent) {
		// artboard intents
		case INTENT.artboardUpdateWidth: {
			return artboardUpdateWidthAction(actionArgs)
		}
		case INTENT.artboardUpdateHeight: {
			return artboardUpdateHeightAction(actionArgs)
		}
		case INTENT.artboardUpdateBackgroundColor: {
			return artboardUpdateBackgroundColorAction(actionArgs)
		}
		// artboard design intents
		case INTENT.artboardCreateDesign: {
			return artboardDesignNewAction(actionArgs)
		}
		case INTENT.artboardReorderDesign: {
			return artboardDesignReorderAction(actionArgs)
		}
		case INTENT.artboardToggleVisibilityDesign: {
			return artboardDesignToggleVisibilityAction(actionArgs)
		}
		case INTENT.artboardDeleteDesign: {
			return artboardDesignDeleteAction(actionArgs)
		}
		// and so on...
		case INTENT.artboardUpdateDesignPalette: {
			return artboardDesignEditPaletteAction(actionArgs)
		}
		case INTENT.artboardCreateDesignSize: {
			return artboardDesignNewSizeAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignSize: {
			return artboardDesignEditSizeAction(actionArgs)
		}
		case INTENT.artboardCreateDesignFill: {
			return artboardDesignNewFillAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignFill: {
			return artboardDesignEditFillAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignFillStyle: {
			return artboardDesignEditFillStyleAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignFillBasis: {
			return artboardDesignEditFillBasisAction(actionArgs)
		}
		case INTENT.artboardCreateDesignStroke: {
			return artboardDesignNewStrokeAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignStroke: {
			return artboardDesignEditStrokeAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignStrokeStyle: {
			return artboardDesignEditStrokeStyleAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignStrokeBasis: {
			return artboardDesignEditStrokeBasisAction(actionArgs)
		}
		case INTENT.artboardCreateDesignLine: {
			return artboardDesignNewLineAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignLineWidth: {
			return artboardDesignEditLineWidthAction(actionArgs)
		}
		case INTENT.artboardCreateDesignRotate: {
			return artboardDesignNewRotateAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignRotate: {
			return artboardDesignEditRotateAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignRotateBasis: {
			return artboardDesignEditRotateBasisAction(actionArgs)
		}
		case INTENT.artboardCreateDesignLayout: {
			return artboardDesignNewLayoutAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignLayoutStyle: {
			return artboardDesignEditLayoutStyleAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignLayoutCount: {
			return artboardDesignEditLayoutCountAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignLayoutRows: {
			return artboardDesignEditLayoutRowsAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignLayoutColumns: {
			return artboardDesignEditLayoutColumnsAction(actionArgs)
		}
		case INTENT.artboardCreateDesignTemplate: {
			return artboardDesignNewTemplateAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignTemplateStyle: {
			return artboardDesignEditTemplateStyleAction(actionArgs)
		}
		case INTENT.artboardCreateLayer: {
			return artboardLayerNewAction(actionArgs)
		}
		case INTENT.artboardUpdateLayerName: {
			return artboardLayerUpdateNameAction(actionArgs)
		}
		case INTENT.artboardUpdateLayerDescription: {
			return artboardLayerUpdateDescriptionAction(actionArgs)
		}
		case INTENT.artboardToggleVisibilityLayer: {
			return artboardLayerToggleVisibilityAction(actionArgs)
		}
		case INTENT.artboardDeleteLayer: {
			return artboardLayerDeleteAction(actionArgs)
		}
		case INTENT.artboardReorderLayer: {
			return artboardLayerReorderAction(actionArgs)
		}
		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const owner = await getOwner(userId)
	invariantResponse(owner, 'Owner not found', { status: 404 })

	const { slug } = params
	const artboard = await getArtboard(userId, slug as string)
	invariantResponse(artboard, 'Artboard not found', { status: 404 })

	const date = new Date(artboard.updatedAt)
	const artboardTimeAgo = formatDistanceToNow(date)

	const layers = await findManyLayers({
		where: { ownerId: userId, artboardId: artboard.id },
	})

	const artboardDesigns = await findManyDesignsWithType({
		where: { artboardId: artboard.id },
	})

	const artboardBuild = await getArtboardBuild(artboard)
	console.log(artboardBuild)

	return json({
		owner,
		artboard,
		artboardTimeAgo,
		artboardDesigns,
		layers,
		artboardBuild,
	})
}

export default function SketchRoute() {
	const data = useLoaderData<typeof loader>()
	return (
		<SketchBody>
			<PanelContainer variant="left">
				<PanelContentLeft artboard={data.artboard} layers={data.layers} />
			</PanelContainer>
			<SketchBodyContent>
				<CanvasContent
					artboard={data.artboard}
					artboardBuild={data.artboardBuild}
				/>
			</SketchBodyContent>
			<PanelContainer>
				<PanelContentRight
					artboard={data.artboard}
					artboardDesigns={data.artboardDesigns}
				/>
			</PanelContainer>
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
