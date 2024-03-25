import { type DataFunctionArgs } from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server'
import { INTENT, LAYER_DESIGN_INTENT } from '../intent'
import {
	artboardDesignDeleteAction,
	artboardDesignNewAction,
	artboardDesignReorderAction,
	artboardDesignToggleVisibilityAction,
} from './artboard-design'
import {
	artboardDesignEditFillAction,
	artboardDesignEditFillBasisAction,
	artboardDesignEditFillStyleAction,
	artboardDesignNewFillAction,
} from './artboard-design-fill'
import {
	artboardDesignEditLayoutColumnsAction,
	artboardDesignEditLayoutCountAction,
	artboardDesignEditLayoutRowsAction,
	artboardDesignEditLayoutStyleAction,
	artboardDesignNewLayoutAction,
} from './artboard-design-layout'
import {
	artboardDesignEditLineWidthAction,
	artboardDesignNewLineAction,
} from './artboard-design-line'
import { artboardDesignEditPaletteAction } from './artboard-design-palette'
import {
	artboardDesignEditRotateAction,
	artboardDesignEditRotateBasisAction,
	artboardDesignNewRotateAction,
} from './artboard-design-rotate'
import {
	artboardDesignEditSizeAction,
	artboardDesignNewSizeAction,
} from './artboard-design-size'
import {
	artboardDesignEditStrokeAction,
	artboardDesignEditStrokeBasisAction,
	artboardDesignEditStrokeStyleAction,
	artboardDesignNewStrokeAction,
} from './artboard-design-stroke'
import {
	artboardDesignEditTemplateStyleAction,
	artboardDesignNewTemplateAction,
} from './artboard-design-template'
import {
	artboardLayerDeleteAction,
	artboardLayerNewAction,
	artboardLayerReorderAction,
	artboardLayerToggleVisibilityAction,
	artboardLayerUpdateDescriptionAction,
	artboardLayerUpdateNameAction,
} from './artboard-layer'
import {
	layerDesignDeleteAction,
	layerDesignNewAction,
	layerDesignReorderAction,
	layerDesignToggleVisibleAction,
} from './layer-design'
import {
	artboardUpdateBackgroundColorAction,
	artboardUpdateHeightAction,
	artboardUpdateWidthAction,
} from './update-artboard'

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	// TODO: remove these since this is all run inside the app
	// await validateCSRF(formData, request.headers)

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
		case LAYER_DESIGN_INTENT.layerCreateDesign: {
			return layerDesignNewAction(actionArgs)
		}
		case LAYER_DESIGN_INTENT.layerDeleteDesign: {
			return layerDesignDeleteAction(actionArgs)
		}
		case LAYER_DESIGN_INTENT.layerToggleVisibleDesign: {
			return layerDesignToggleVisibleAction(actionArgs)
		}
		case LAYER_DESIGN_INTENT.layerReorderDesign: {
			return layerDesignReorderAction(actionArgs)
		}
		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}
