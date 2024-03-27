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
	for (let i = 0; i < layers.length; i++) {
		const layer = layers[i]
		const layerDrawItems = buildLayerDrawItems({ ctx, layer })
		drawLayers.push(layerDrawItems)
	}
	return drawLayers
}

const buildLayerDrawItems = ({
	ctx,
	layer,
}: {
	ctx: CanvasRenderingContext2D
	layer: IArtboardLayerBuild
}): ICanvasDrawItem[] => {
	const count = canvasBuildLayerDrawCountService({ layer })

	const layerDrawItems = []
	for (let index = 0; index < count; index++) {
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
		index,
	})
	const size = canvasBuildLayerDrawSizeService({ layer, index })
	const fill = canvasBuildLayerDrawFillService({ layer, index, pixelHex })
	const stroke = canvasBuildLayerDrawStrokeService({ layer, index, pixelHex })
	const line = canvasBuildLayerDrawLineService({ layer, index })
	const rotate = canvasBuildLayerDrawRotateService({ layer, index })
	const template = canvasBuildLayerDrawTemplateService({ layer, index })

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
