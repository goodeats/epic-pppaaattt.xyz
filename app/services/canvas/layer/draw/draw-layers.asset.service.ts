import { type IAssetGenerationByType } from '#app/models/asset/asset.generation.server'
import { type ILoadedAssets } from '../../draw.load-assets.service'

export const canvasDrawLayerAssets = ({
	ctx,
	assets,
	loadedAssets,
	timeToDraw,
}: {
	ctx: CanvasRenderingContext2D
	assets: IAssetGenerationByType
	loadedAssets: ILoadedAssets
	timeToDraw?: boolean
}) => {
	const { assetImages } = assets

	for (let i = 0; i < assetImages.length; i++) {
		const image = assetImages[i]

		// may want to draw image to get pixel data on build
		if (timeToDraw && image.hideOnDraw) continue

		const img = loadedAssets[image.id]
		const { x, y, width, height } = image
		ctx.drawImage(img, x, y, width, height)
	}
}
