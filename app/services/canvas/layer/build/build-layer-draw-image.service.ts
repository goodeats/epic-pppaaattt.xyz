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
}): IAssetImageGeneration[] => {
	const { assets } = layer
	const { assetImages } = assets

	if (!assetImages.length) return []

	return assetImages.map(image => {
		const src = getAssetImgSrc({ image })
		const fit = canvasBuildLayerDrawImageFitService({
			ctx,
			image,
		}) as IAssetImageDrawGeneration
		const hideOnDraw = image.attributes.hideOnDraw || false

		return {
			id: image.id,
			src,
			...fit,
			hideOnDraw,
		}
	})
}
