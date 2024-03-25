import { type DataFunctionArgs } from '@remix-run/node'
import { requireUserId } from '#app/utils/auth.server'
import {
	ARTBOARD_DESIGN_INTENT,
	ARTBOARD_INTENT,
	DESIGN_FILL_INTENT,
	DESIGN_LAYOUT_INTENT,
	DESIGN_LINE_INTENT,
	DESIGN_PALETTE_INTENT,
	DESIGN_ROTATE_INTENT,
	DESIGN_SIZE_INTENT,
	DESIGN_STROKE_INTENT,
	DESIGN_TEMPLATE_INTENT,
	INTENT,
	LAYER_DESIGN_INTENT,
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
	artboardDesignEditFillAction,
	artboardDesignEditFillBasisAction,
	artboardDesignEditFillStyleAction,
} from './artboard-design-fill'
import {
	artboardDesignEditLayoutColumnsAction,
	artboardDesignEditLayoutCountAction,
	artboardDesignEditLayoutRowsAction,
	artboardDesignEditLayoutStyleAction,
} from './artboard-design-layout'
import { artboardDesignEditLineWidthAction } from './artboard-design-line'
import { artboardDesignEditPaletteAction } from './artboard-design-palette'
import {
	artboardDesignEditRotateAction,
	artboardDesignEditRotateBasisAction,
} from './artboard-design-rotate'
import { artboardDesignEditSizeAction } from './artboard-design-size'
import {
	artboardDesignEditStrokeAction,
	artboardDesignEditStrokeBasisAction,
	artboardDesignEditStrokeStyleAction,
} from './artboard-design-stroke'
import { artboardDesignEditTemplateStyleAction } from './artboard-design-template'
import {
	artboardLayerDeleteAction,
	artboardLayerNewAction,
	artboardLayerReorderAction,
	artboardLayerToggleVisibilityAction,
	artboardLayerUpdateDescriptionAction,
	artboardLayerUpdateNameAction,
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
import { designSizeEditValueAction } from './design-size'
import {
	designStrokeEditBasisAction,
	designStrokeEditStyleAction,
	designStrokeEditValueAction,
} from './design-stroke'
import { designTemplateEditStyleAction } from './design-template'
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
		// and so on...
		case INTENT.artboardUpdateDesignPalette: {
			return artboardDesignEditPaletteAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignSize: {
			return artboardDesignEditSizeAction(actionArgs)
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
		case INTENT.artboardUpdateDesignStroke: {
			return artboardDesignEditStrokeAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignStrokeStyle: {
			return artboardDesignEditStrokeStyleAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignStrokeBasis: {
			return artboardDesignEditStrokeBasisAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignLineWidth: {
			return artboardDesignEditLineWidthAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignRotate: {
			return artboardDesignEditRotateAction(actionArgs)
		}
		case INTENT.artboardUpdateDesignRotateBasis: {
			return artboardDesignEditRotateBasisAction(actionArgs)
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
