import { ctxBegin, ctxEnd } from '../../ctx.utils'
import { type ICanvasDrawItem } from '../../draw.service'
import { drawLayerItemFillService } from './draw-layer-item-fill.service'
import { drawLayerItemLineService } from './draw-layer-item-line.service'
import { drawLayerItemStrokeService } from './draw-layer-item-stroke.service'
import { drawLayerItemTemplateService } from './draw-layer-item-template.service'

export const drawLayerItemService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: ICanvasDrawItem
}) => {
	// Step 1: begin ctx
	ctxBegin({ ctx })

	// Step 2: draw the template at the position with rotation
	drawLayerItemTemplateService({ ctx, layerDrawItem })

	// Step 3: set fill style
	drawLayerItemFillService({ ctx, layerDrawItem })

	// Step 4: set line width (before stroke)
	drawLayerItemLineService({ ctx, layerDrawItem })

	// Step 5: set stroke style
	drawLayerItemStrokeService({ ctx, layerDrawItem })

	// Final Step: end ctx
	ctxEnd({ ctx })
}
