import { type IGenerationItem } from '#app/definitions/artboard-generator'
import { drawTemplateTriangleService } from './templates/draw-layer-item-template-triangle.service'

export const drawLayerItemTemplateService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: IGenerationItem
}) => {
	const { template } = layerDrawItem

	if (template === 'triangle') {
		drawTemplateTriangleService({ ctx, layerDrawItem })
	}

	return
}
