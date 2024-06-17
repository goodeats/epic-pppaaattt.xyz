import {
	type IGenerationLayer,
	type ILayerGenerator,
} from '#app/definitions/artwork-generator'
import { type ILoadedAssets } from '../../draw.load-assets.service'
import { buildLayerGenerationAssets } from './build-draw-layers.layer.assets.service'
import { buildLayerGenerationItems } from './build-draw-layers.layer.items.service'

export const canvasLayerBuildDrawLayersLayerService = ({
	ctx,
	layer,
	loadedAssets,
}: {
	ctx: CanvasRenderingContext2D
	layer: ILayerGenerator
	loadedAssets: ILoadedAssets
}): IGenerationLayer => {
	const assets = buildLayerGenerationAssets({ ctx, layer })
	const items = buildLayerGenerationItems({ ctx, layer, assets, loadedAssets })
	return {
		generator: layer,
		assets,
		items,
	}
}
