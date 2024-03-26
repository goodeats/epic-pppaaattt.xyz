import {
	type IArtboardLayerBuild,
	type IArtboardBuild,
} from '../../../../queries'
import { type ICanvasDrawItem } from '../../draw.service'
import { canvasBuildLayerDrawCountService } from './build-layer-draw-count.service'
import { canvasBuildLayerDrawFillService } from './build-layer-draw-fill.service'
import { canvasBuildLayerDrawLineService } from './build-layer-draw-line.service'
import { canvasBuildLayerDrawPositionService } from './build-layer-draw-position.service'
import { canvasBuildLayerDrawRotateService } from './build-layer-draw-rotate.service'
import { canvasBuildLayerDrawSizeService } from './build-layer-draw-size.service'
import { canvasBuildLayerDrawStrokeService } from './build-layer-draw-stroke.service'
import { canvasBuildLayerDrawTemplateService } from './build-layer-draw-template.service'

export const canvasLayerBuildDrawLayersService = ({
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
	const count = canvasBuildLayerDrawCountService({ layer })

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
	const { x, y, pixelHex } = canvasBuildLayerDrawPositionService({
		ctx,
		layer,
	})
	const size = canvasBuildLayerDrawSizeService({ layer })
	const fill = canvasBuildLayerDrawFillService({ layer, pixelHex })
	const stroke = canvasBuildLayerDrawStrokeService({ layer, pixelHex })
	const line = canvasBuildLayerDrawLineService({ layer })
	const rotate = canvasBuildLayerDrawRotateService({ layer })
	const template = canvasBuildLayerDrawTemplateService({ layer })

	return {
		id: `layer-${layer.layerName}-${index}-${count}`,
		fillStyle: fill,
		lineWidth: line,
		position: { x, y },
		rotate,
		size,
		strokeStyle: stroke,
		template,
	}
}
