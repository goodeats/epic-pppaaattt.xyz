import { type IArtboardGenerator } from '#app/definitions/artboard-generator'
import { type PickedArtboardType } from '../../queries'
import { canvasDrawBackgroundService } from './draw-background.service'
import { canvasLayerBuildDrawLayersService } from './layer/build/build-draw-layers.service'
import { canvasDrawLayersService } from './layer/draw/draw-layers.service'

export const canvasDrawService = ({
	canvas,
	artboard,
	artboardGenerator,
}: {
	canvas: HTMLCanvasElement
	artboard: PickedArtboardType
	artboardGenerator: IArtboardGenerator
}) => {
	// Step 1: get canvas
	const ctx = getContext(canvas)

	// Step 2: draw background
	canvasDrawBackgroundService({ ctx, artboard })

	// Step 3: get draw items for each layer
	const drawLayers = canvasLayerBuildDrawLayersService({
		ctx,
		artboardGenerator,
	})

	// Step 4: draw layers to canvas
	canvasDrawLayersService({ ctx, drawLayers })
}

const getContext = (canvas: HTMLCanvasElement) => {
	const ctx = canvas.getContext('2d')
	if (!ctx) throw new Error('Canvas context not found')
	return ctx
}
