import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'
import { getArtworkVersionVisibleRotates } from '#app/models/design-artwork-version/design-artwork-version.server'
import { getLayerVisibleRotates } from '#app/models/design-layer/design-layer.server'
import { type IRotate } from '#app/models/design-type/rotate/rotate.server'
import { type ILayerWithChildren } from '#app/models/layer/layer.server'
import { type rotateBasisTypeEnum } from '#app/schema/rotate'
import { isArrayRotateBasisType } from '#app/utils/rotate'

export const getRotates = async ({
	artworkVersionId,
	layerId,
	rotate,
}: {
	artworkVersionId?: IArtworkVersionWithChildren['id']
	layerId?: ILayerWithChildren['id']
	rotate: IRotate
}) => {
	const allRotates = isArrayRotateBasisType(rotate.basis as rotateBasisTypeEnum)

	if (allRotates) {
		if (artworkVersionId) {
			return await getArtworkVersionVisibleRotates({ artworkVersionId })
		} else if (layerId) {
			return await getLayerVisibleRotates({ layerId })
		}
	}
	return []
}
