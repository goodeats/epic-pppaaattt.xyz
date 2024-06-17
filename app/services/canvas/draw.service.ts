import { invariant } from '@epic-web/invariant'
import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'
import { canvasDrawBackgroundService } from './draw-background.service'
import { canvasDrawWatermarkService } from './draw-watermark.service'
import { canvasDrawLoadAssetsService } from './draw.load-assets.service'
import { canvasLayerBuildDrawLayersService } from './layer/build/build-draw-layers.service'
import { canvasDrawLayersService } from './layer/draw/draw-layers.service'

export const canvasDrawService = async ({
	canvas,
	generator,
}: {
	canvas: HTMLCanvasElement
	generator: IArtworkVersionGenerator
}) => {
	// Step 0: load assets
	const loadedAssets = await canvasDrawLoadAssetsService({ generator })

	// Step 1: get canvas
	const ctx = getContext(canvas)

	// Step 2: draw background
	canvasDrawBackgroundService({ ctx, generator })

	// Step 3: get draw items for each layer
	const drawLayers = canvasLayerBuildDrawLayersService({
		ctx,
		generator,
		loadedAssets,
	})

	// Step 4: draw layers to canvas
	canvasDrawLayersService({ ctx, drawLayers, loadedAssets })

	// Step 5: draw watermark
	canvasDrawWatermarkService({ ctx, generator })
}

const getContext = (canvas: HTMLCanvasElement) => {
	const ctx = canvas.getContext('2d')
	invariant(ctx, 'Canvas context not found')
	return ctx
}
