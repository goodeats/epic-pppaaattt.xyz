import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'
import { getAssetImgSrc } from '#app/models/asset/image/utils'
import { loadImage } from '#app/utils/image'

// loaded assets:
// key: asset id
// value: image element, or something else when other assets are added

export interface ILoadedAssets {
	[key: string]: HTMLImageElement
}

export const canvasDrawLoadAssetsService = async ({
	generator,
}: {
	generator: IArtworkVersionGenerator
}): Promise<ILoadedAssets> => {
	const { layers } = generator
	const loadedAssets: ILoadedAssets = {}

	const imageLoadPromises: Promise<void>[] = []

	for (const layer of layers) {
		const {
			assets: { assetImages },
		} = layer

		for (const image of assetImages) {
			const src = getAssetImgSrc({ image })
			const loadPromise = loadImage({ src })
				.then(img => {
					loadedAssets[image.id] = img
				})
				.catch(error => {
					console.error(
						`Failed to load image with ID ${image.id} from source: ${src}`,
						error,
					)
				})

			imageLoadPromises.push(loadPromise)
		}
	}

	await Promise.all(imageLoadPromises)

	return loadedAssets
}
