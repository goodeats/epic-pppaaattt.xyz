import { type PickedArtboardType, type IArtboardBuild } from '../../queries'
import { canvasDrawBackgroundService } from './draw-background.service'
import { canvasLayerBuildDrawLayersService } from './layer/build/build-draw-layers.service'

export interface ICanvasDrawItem {
	id: string
	fillStyle: string
	lineWidth: number
	position: {
		x: number
		y: number
	}
	rotate: number
	size: number
	strokeStyle: string
	template: string
}

export const canvasDrawService = ({
	canvas,
	artboard,
	artboardBuild,
}: {
	canvas: HTMLCanvasElement
	artboard: PickedArtboardType
	artboardBuild: IArtboardBuild
}) => {
	// Step 1: get canvas
	const ctx = getContext(canvas)

	// Step 2: draw background
	canvasDrawBackgroundService({ ctx, artboard })

	// Step 3: get draw items for each layer
	const drawLayers = canvasLayerBuildDrawLayersService({ ctx, artboardBuild })
	console.log('drawLayers', drawLayers)
}

const getContext = (canvas: HTMLCanvasElement) => {
	const ctx = canvas.getContext('2d')
	if (!ctx) throw new Error('Canvas context not found')
	return ctx
}
