import {
	type IArtboardVersionGenerator,
	type IGenerationItem,
	type ILayerGenerator,
} from '#app/definitions/artboard-generator'
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
	generator,
}: {
	ctx: CanvasRenderingContext2D
	generator: IArtboardVersionGenerator
}): IGenerationItem[][] => {
	const { layers } = generator

	const drawLayers = []
	for (let i = 0; i < layers.length; i++) {
		const layer = layers[i]
		const layerDrawItems = buildLayerGenerationItems({ ctx, layer })
		drawLayers.push(layerDrawItems)
	}
	return drawLayers
}

const buildLayerGenerationItems = ({
	ctx,
	layer,
}: {
	ctx: CanvasRenderingContext2D
	layer: ILayerGenerator
}): IGenerationItem[] => {
	const count = canvasBuildLayerDrawCountService({ layer })

	const layerGenerationItems = []
	for (let index = 0; index < count; index++) {
		const generationItem = buildLayerGenerationItem({
			ctx,
			layer,
			index,
			count,
		})
		layerGenerationItems.push(generationItem)
	}
	return layerGenerationItems
}

const buildLayerGenerationItem = ({
	ctx,
	layer,
	index,
	count,
}: {
	ctx: CanvasRenderingContext2D
	layer: ILayerGenerator
	index: number
	count: number
}): IGenerationItem => {
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
		id: `layer-${layer.id}-${index}-${count}`,
		fillStyle: fill,
		lineWidth: line,
		position: { x, y },
		rotate,
		size,
		strokeStyle: stroke,
		template,
	}
}
