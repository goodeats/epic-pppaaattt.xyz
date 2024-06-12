import { type IArtworkWithAssets } from '#app/models/artwork/artwork.server'
import { useArtworkFromVersion } from '#app/models/artwork/hooks'
import { AssetTypeEnum } from '#app/schema/asset'
import { filterAssetType } from '#app/utils/asset'
import { type IAssetImage } from './image.server'

export function useAssetImagesArtwork(): IAssetImage[] {
	const artwork = useArtworkFromVersion()
	const { assets } = artwork as IArtworkWithAssets
	return filterAssetType({
		assets,
		type: AssetTypeEnum.IMAGE,
	}) as IAssetImage[]
}
