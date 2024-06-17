import {
	type IGenerationItem,
	type ILayerGenerator,
} from '#app/definitions/artwork-generator'
import { type IAssetGenerationByType } from '#app/models/asset/asset.generation.server'
import { canvasRedrawDrawBackgroundService } from '../../draw-background.service'
import { type ILoadedAssets } from '../../draw.load-assets.service'
import { canvasDrawLayerAssets } from '../draw/draw-layers.asset.service'
import { canvasBuildLayerDrawCountService } from './build-layer-draw-count.service'
import { canvasBuildLayerDrawFillService } from './build-layer-draw-fill.service'
import { canvasBuildLayerDrawLineService } from './build-layer-draw-line.service'
import { shouldGetPixelHex } from './build-layer-draw-position.pixel.service'
import { canvasBuildLayerDrawPositionService } from './build-layer-draw-position.service'
import { canvasBuildLayerDrawRotateService } from './build-layer-draw-rotate.service'
import { canvasBuildLayerDrawSizeService } from './build-layer-draw-size.service'
import { canvasBuildLayerDrawStrokeService } from './build-layer-draw-stroke.service'
import { canvasBuildLayerDrawTemplateService } from './build-layer-draw-template.service'

export const buildLayerGenerationItems = ({
	ctx,
	layer,
	assets,
	loadedAssets,
}: {
	ctx: CanvasRenderingContext2D
	layer: ILayerGenerator
	assets: IAssetGenerationByType
	loadedAssets: ILoadedAssets
}): IGenerationItem[] => {
	const count = canvasBuildLayerDrawCountService({ layer })
	const drawAssets = shouldGetPixelHex({ layer })

	if (drawAssets) {
		canvasDrawLayerAssets({ ctx, assets, loadedAssets })
	}

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

	canvasRedrawDrawBackgroundService({ ctx, background: layer.background })

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
