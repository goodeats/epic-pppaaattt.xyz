import { type ILayerGenerator } from '#app/definitions/artwork-generator'
import {
	type IAssetImageDrawGeneration,
	type IAssetImageGeneration,
} from '#app/models/asset/image/image.generate.server'
import { getAssetImgSrc } from '#app/models/asset/image/utils'
import { canvasBuildLayerDrawImageFitService } from './build-layer-draw-image.fit.service'

export const canvasBuildLayerDrawImageService = ({
	ctx,
	layer,
}: {
	ctx: CanvasRenderingContext2D
	layer: ILayerGenerator
}): IAssetImageGeneration | null => {
	const { assets } = layer
	const { assetImages } = assets

	if (!assetImages.length) return null

	// just one image to start
	const image = assetImages[0]

	const src = getAssetImgSrc({ image })
	const fit = canvasBuildLayerDrawImageFitService({
		ctx,
		image,
	}) as IAssetImageDrawGeneration

	return {
		src,
		...fit,
	}
}
