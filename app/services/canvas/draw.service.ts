import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'
import { canvasDrawBackgroundService } from './draw-background.service'
import { canvasLayerBuildDrawLayersService } from './layer/build/build-draw-layers.service'
import { canvasDrawLayersService } from './layer/draw/draw-layers.service'

export const canvasDrawService = ({
	canvas,
	generator,
}: {
	canvas: HTMLCanvasElement
	generator: IArtworkVersionGenerator
}) => {
	// Step 1: get canvas
	const ctx = getContext(canvas)

	// Step 2: draw background
	canvasDrawBackgroundService({ ctx, generator })

	// Step 3: get draw items for each layer
	const drawLayers = canvasLayerBuildDrawLayersService({
		ctx,
		generator,
	})

	// Step 4: draw layers to canvas
	canvasDrawLayersService({ ctx, drawLayers })
}

const getContext = (canvas: HTMLCanvasElement) => {
	const ctx = canvas.getContext('2d')
	if (!ctx) throw new Error('Canvas context not found')
	return ctx
}
