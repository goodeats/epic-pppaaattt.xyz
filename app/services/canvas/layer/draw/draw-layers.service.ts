import {
	type IGenerationLayer,
	type IGenerationItem,
	type IGenerationAssets,
} from '#app/definitions/artwork-generator'
import { loadImage } from '#app/utils/image'
import { drawLayerItemService } from './draw-layer-item.service'

export const canvasDrawLayersService = ({
	ctx,
	drawLayers,
}: {
	ctx: CanvasRenderingContext2D
	drawLayers: IGenerationLayer[]
}) => {
	for (let i = 0; i < drawLayers.length; i++) {
		const layer = drawLayers[i]
		drawLayerAssets({ ctx, assets: layer.assets })
		drawLayerItems({ ctx, items: layer.items })
	}
}

const drawLayerAssets = ({
	ctx,
	assets,
}: {
	ctx: CanvasRenderingContext2D
	assets: IGenerationAssets
}) => {
	const { image } = assets
	if (image && image.src) {
		console.log('assets.image: ', image)
		const img = loadImage({ src: image.src })
		console.log('img: ', img)
		// load image
		// async
		// const { x, y, width, height } = assets.image
		// ctx.drawImage(img, x, y, width, height)
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
		// console.log('count: ', i)
		drawLayerItemService({ ctx, layerDrawItem })
	}
}
