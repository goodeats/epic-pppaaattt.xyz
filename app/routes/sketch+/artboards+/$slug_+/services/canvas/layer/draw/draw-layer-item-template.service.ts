import { type ICanvasDrawItem } from '../../draw.service'
import { drawTemplateTriangleService } from './templates/draw-layer-item-template-triangle.service'

export const drawLayerItemTemplateService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: ICanvasDrawItem
}) => {
	const { template } = layerDrawItem

	if (template === 'triangle') {
		drawTemplateTriangleService({ ctx, layerDrawItem })
	}

	return
}
