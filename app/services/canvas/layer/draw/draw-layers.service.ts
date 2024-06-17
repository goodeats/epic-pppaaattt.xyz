import {
	type IGenerationLayer,
	type IGenerationItem,
} from '#app/definitions/artwork-generator'
import { type ILoadedAssets } from '../../draw.load-assets.service'
import { drawLayerItemService } from './draw-layer-item.service'
import { canvasDrawLayerAssets } from './draw-layers.asset.service'

export const canvasDrawLayersService = ({
	ctx,
	drawLayers,
	loadedAssets,
}: {
	ctx: CanvasRenderingContext2D
	drawLayers: IGenerationLayer[]
	loadedAssets: ILoadedAssets
}) => {
	for (let i = 0; i < drawLayers.length; i++) {
		const layer = drawLayers[i]
		canvasDrawLayerAssets({
			ctx,
			assets: layer.assets,
			loadedAssets,
			timeToDraw: true,
		})
		drawLayerItems({ ctx, items: layer.items })
	}
}

const drawLayerItems = ({
	ctx,
	items,
}: {
	ctx: CanvasRenderingContext2D
	items: IGenerationItem[]
}) => {
	for (let i = 0; i < items.length; i++) {
		const layerDrawItem = items[i]
		drawLayerItemService({ ctx, layerDrawItem })
	}
}
