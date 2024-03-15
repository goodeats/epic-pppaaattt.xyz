import {
	type PickedArtboardType,
	type IArtboardBuild,
	type IArtboardLayerBuild,
} from '../../queries'
import { canvasDrawBackgroundService } from './draw-background.service'
import { canvasDrawLayerCountService } from './layer/draw-layer-count.service'
import { canvasDrawLayerFillService } from './layer/draw-layer-fill.service'
import { canvasDrawLayerLineService } from './layer/draw-layer-line.service'
import { canvasDrawLayerPositionService } from './layer/draw-layer-position.service'
import { canvasDrawLayerRotateService } from './layer/draw-layer-rotate.service'
import { canvasDrawLayerSizeService } from './layer/draw-layer-size.service'
import { canvasDrawLayerStrokeService } from './layer/draw-layer-stroke.service'
import { canvasDrawLayerTemplateService } from './layer/draw-layer-template.service'

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
	const ctx = getContext(canvas)
	canvasDrawBackgroundService({ ctx, artboard })

	const drawLayers = buildDrawLayers({ ctx, artboardBuild })
	console.log('drawLayers', drawLayers)
}

const getContext = (canvas: HTMLCanvasElement) => {
	const ctx = canvas.getContext('2d')
	if (!ctx) throw new Error('Canvas context not found')
	return ctx
}

const buildDrawLayers = ({
	ctx,
	artboardBuild,
}: {
	ctx: CanvasRenderingContext2D
	artboardBuild: IArtboardBuild
}): ICanvasDrawItem[][] => {
	const { layers } = artboardBuild

	const drawLayers = []
	for (let index = 0; index < layers.length; index++) {
		const layer = layers[index]
		const layerDrawItems = buildLayerDrawItems({ ctx, layer, index })
		drawLayers.push(layerDrawItems)
	}
	return drawLayers
}

const buildLayerDrawItems = ({
	ctx,
	layer,
	index,
}: {
	ctx: CanvasRenderingContext2D
	layer: IArtboardLayerBuild
	index: number
}): ICanvasDrawItem[] => {
	const { count } = canvasDrawLayerCountService({
		layout: layer.layout,
	})
	if (!count) return []

	const layerDrawItems = []
	for (let i = 0; i < count; i++) {
		const layerDrawItem = buildLayerDrawItem({ ctx, layer, index, count })
		layerDrawItems.push(layerDrawItem)
	}
	return layerDrawItems
}

const buildLayerDrawItem = ({
	ctx,
	layer,
	index,
	count,
}: {
	ctx: CanvasRenderingContext2D
	layer: IArtboardLayerBuild
	index: number
	count: number
}): ICanvasDrawItem => {
	const { x, y } = canvasDrawLayerPositionService({
		layer,
	})
	const size = canvasDrawLayerSizeService({ layer })
	const fill = canvasDrawLayerFillService({ layer })
	const stroke = canvasDrawLayerStrokeService({ layer })
	const line = canvasDrawLayerLineService({ layer })
	const rotate = canvasDrawLayerRotateService({ layer })
	const template = canvasDrawLayerTemplateService({ layer })

	return {
		id: `layer-${index}-${count}`,
		fillStyle: fill,
		lineWidth: line,
		position: { x, y },
		rotate,
		size,
		strokeStyle: stroke,
		template,
	}
}
