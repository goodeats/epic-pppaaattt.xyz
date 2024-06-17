import {
	type IGenerationLayer,
	type IArtworkVersionGenerator,
} from '#app/definitions/artwork-generator'
import { type ILoadedAssets } from '../../draw.load-assets.service'
import { canvasLayerBuildDrawLayersLayerService } from './build-draw-layers.layer.service'

export const canvasLayerBuildDrawLayersService = ({
	ctx,
	generator,
	loadedAssets,
}: {
	ctx: CanvasRenderingContext2D
	generator: IArtworkVersionGenerator
	loadedAssets: ILoadedAssets
}): IGenerationLayer[] => {
	const { layers } = generator

	return layers.map(layer =>
		canvasLayerBuildDrawLayersLayerService({
			ctx,
			layer,
			loadedAssets,
		}),
	)
}
