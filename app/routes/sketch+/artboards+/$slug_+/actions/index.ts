import { type DataFunctionArgs } from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server'
import {
	ARTBOARD_DESIGN_INTENT,
	ARTBOARD_INTENT,
	ARTBOARD_LAYER_INTENT,
	DESIGN_FILL_INTENT,
	DESIGN_LAYOUT_INTENT,
	DESIGN_LINE_INTENT,
	DESIGN_PALETTE_INTENT,
	DESIGN_ROTATE_INTENT,
	DESIGN_SIZE_INTENT,
	DESIGN_STROKE_INTENT,
	DESIGN_TEMPLATE_INTENT,
	LAYER_DESIGN_INTENT,
	LAYER_INTENT,
} from '../intent'
import {
	artboardEditBackgroundColorAction,
	artboardEditHeightAction,
	artboardEditWidthAction,
} from './artboard'
import {
	artboardDesignDeleteAction,
	artboardDesignNewAction,
	artboardDesignReorderAction,
	artboardDesignToggleVisibilityAction,
} from './artboard-design'
import {
	artboardLayerDeleteAction,
	artboardLayerNewAction,
	artboardLayerReorderAction,
	artboardLayerToggleVisibleAction,
} from './artboard-layer'
import {
	designFillEditBasisAction,
	designFillEditStyleAction,
	designFillEditValueAction,
} from './design-fill'
import {
	designLayoutEditColumnsAction,
	designLayoutEditCountAction,
	designLayoutEditRowsAction,
	designLayoutEditStyleAction,
} from './design-layout'
import { designLineEditWidthAction } from './design-line'
import { designPaletteEditValueAction } from './design-palette'
import {
	designRotateEditBasisAction,
	designRotateEditRotationAction,
} from './design-rotate'
import {
	designSizeEditBasisAction,
	designSizeEditFormatAction,
	designSizeEditValueAction,
} from './design-size'
import {
	designStrokeEditBasisAction,
	designStrokeEditStyleAction,
	designStrokeEditValueAction,
} from './design-stroke'
import { designTemplateEditStyleAction } from './design-template'
import { layerEditDescriptionAction, layerEditNameAction } from './layer'
import {
	layerDesignDeleteAction,
	layerDesignNewAction,
	layerDesignReorderAction,
	layerDesignToggleVisibleAction,
} from './layer-design'

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	// TODO: remove these since this is all run inside the app
	// await validateCSRF(formData, request.headers)

	const actionArgs = { request, userId, formData }
	const intent = formData.get('intent')
	switch (intent) {
		// ARTBOARD INTENTS
		case ARTBOARD_INTENT.updateArtboardWidth: {
			return artboardEditWidthAction(actionArgs)
		}
		case ARTBOARD_INTENT.updateArtboardHeight: {
			return artboardEditHeightAction(actionArgs)
		}
		case ARTBOARD_INTENT.updateArtboardBackgroundColor: {
			return artboardEditBackgroundColorAction(actionArgs)
		}

		// ARTBOARD DESIGN INTENTS
		case ARTBOARD_DESIGN_INTENT.artboardCreateDesign: {
			return artboardDesignNewAction(actionArgs)
		}
		case ARTBOARD_DESIGN_INTENT.artboardReorderDesign: {
			return artboardDesignReorderAction(actionArgs)
		}
		case ARTBOARD_DESIGN_INTENT.artboardToggleVisibleDesign: {
			return artboardDesignToggleVisibilityAction(actionArgs)
		}
		case ARTBOARD_DESIGN_INTENT.artboardDeleteDesign: {
			return artboardDesignDeleteAction(actionArgs)
		}

		// ARTBOARD LAYER INTENTS
		case ARTBOARD_LAYER_INTENT.artboardCreateLayer: {
			return artboardLayerNewAction(actionArgs)
		}
		case ARTBOARD_LAYER_INTENT.artboardToggleVisibleLayer: {
			return artboardLayerToggleVisibleAction(actionArgs)
		}
		case ARTBOARD_LAYER_INTENT.artboardDeleteLayer: {
			return artboardLayerDeleteAction(actionArgs)
		}
		case ARTBOARD_LAYER_INTENT.artboardReorderLayer: {
			return artboardLayerReorderAction(actionArgs)
		}

		// LAYER INTENTS
		case LAYER_INTENT.updateLayerName: {
			return layerEditNameAction(actionArgs)
		}
		case LAYER_INTENT.updateLayerDescription: {
			return layerEditDescriptionAction(actionArgs)
		}

		// LAYER DESIGN INTENTS
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

		// DESIGN INTENTS
		// PALETTE DESIGN INTENTS
		case DESIGN_PALETTE_INTENT.updateDesignPaletteValue: {
			return designPaletteEditValueAction(actionArgs)
		}
		// SIZE DESIGN INTENTS
		case DESIGN_SIZE_INTENT.updateDesignSizeValue: {
			return designSizeEditValueAction(actionArgs)
		}
		case DESIGN_SIZE_INTENT.updateDesignSizeBasis: {
			return designSizeEditBasisAction(actionArgs)
		}
		case DESIGN_SIZE_INTENT.updateDesignSizeFormat: {
			return designSizeEditFormatAction(actionArgs)
		}
		// FILL DESIGN INTENTS
		case DESIGN_FILL_INTENT.updateDesignFillValue: {
			return designFillEditValueAction(actionArgs)
		}
		case DESIGN_FILL_INTENT.updateDesignFillStyle: {
			return designFillEditStyleAction(actionArgs)
		}
		case DESIGN_FILL_INTENT.updateDesignFillBasis: {
			return designFillEditBasisAction(actionArgs)
		}
		// STROKE DESIGN INTENTS
		case DESIGN_STROKE_INTENT.updateDesignStrokeValue: {
			return designStrokeEditValueAction(actionArgs)
		}
		case DESIGN_STROKE_INTENT.updateDesignStrokeStyle: {
			return designStrokeEditStyleAction(actionArgs)
		}
		case DESIGN_STROKE_INTENT.updateDesignStrokeBasis: {
			return designStrokeEditBasisAction(actionArgs)
		}
		// LINE DESIGN INTENTS
		case DESIGN_LINE_INTENT.updateDesignLineWidth: {
			return designLineEditWidthAction(actionArgs)
		}
		// ROTATE DESIGN INTENTS
		case DESIGN_ROTATE_INTENT.updateDesignRotateRotation: {
			return designRotateEditRotationAction(actionArgs)
		}
		case DESIGN_ROTATE_INTENT.updateDesignRotateBasis: {
			return designRotateEditBasisAction(actionArgs)
		}
		// LAYOUT DESIGN INTENTS
		case DESIGN_LAYOUT_INTENT.updateDesignLayoutStyle: {
			return designLayoutEditStyleAction(actionArgs)
		}
		case DESIGN_LAYOUT_INTENT.updateDesignLayoutCount: {
			return designLayoutEditCountAction(actionArgs)
		}
		case DESIGN_LAYOUT_INTENT.updateDesignLayoutRows: {
			return designLayoutEditRowsAction(actionArgs)
		}
		case DESIGN_LAYOUT_INTENT.updateDesignLayoutColumns: {
			return designLayoutEditColumnsAction(actionArgs)
		}
		// TEMPLATE DESIGN INTENTS
		case DESIGN_TEMPLATE_INTENT.updateDesignTemplateStyle: {
			return designTemplateEditStyleAction(actionArgs)
		}

		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}
