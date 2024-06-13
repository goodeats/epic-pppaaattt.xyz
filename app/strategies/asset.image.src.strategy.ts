import { getArtworkAssetImgSrc } from '#app/utils/misc'

export interface IAssetImageSrcStrategy {
	getAssetSrc(args: { assetId: string; parentId: string }): string
}

export class ArtworkAssetImageSrcStrategy implements IAssetImageSrcStrategy {
	getAssetSrc({
		assetId,
		parentId,
	}: {
		assetId: string
		parentId: string
	}): string {
		return getArtworkAssetImgSrc({ artworkId: parentId, imageId: assetId })
	}
}
