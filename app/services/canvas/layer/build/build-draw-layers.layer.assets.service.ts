import { type ILayerGenerator } from '#app/definitions/artwork-generator'
import { type IAssetGenerationByType } from '#app/models/asset/asset.generation.server'
import { canvasBuildLayerDrawImageService } from './build-layer-draw-image.service'

export const buildLayerGenerationAssets = ({
	ctx,
	layer,
}: {
	ctx: CanvasRenderingContext2D
	layer: ILayerGenerator
}): IAssetGenerationByType => {
	const assetImages = canvasBuildLayerDrawImageService({ ctx, layer })

	return {
		assetImages,
	}
}
