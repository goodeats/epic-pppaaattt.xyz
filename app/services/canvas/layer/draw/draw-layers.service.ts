import { type IGenerationItem } from '#app/definitions/artboard-generator'
import { drawLayerItemService } from './draw-layer-item.service'

export const canvasDrawLayersService = ({
	ctx,
	drawLayers,
}: {
	ctx: CanvasRenderingContext2D
	drawLayers: IGenerationItem[][]
}) => {
	for (let i = 0; i < drawLayers.length; i++) {
		const layerDrawItems = drawLayers[i]
		drawLayerItems({ ctx, layerDrawItems })
	}
}

const drawLayerItems = ({
	ctx,
	layerDrawItems,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItems: IGenerationItem[]
}) => {
	for (let i = 0; i < layerDrawItems.length; i++) {
		const layerDrawItem = layerDrawItems[i]
		drawLayerItemService({ ctx, layerDrawItem })
	}
}
