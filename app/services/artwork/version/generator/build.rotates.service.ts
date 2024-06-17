import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'
import { type IDesignRotate } from '#app/models/design/rotate/rotate.server'
import { isArrayRotateBasisType } from '#app/models/design/rotate/utils'
import { getArtworkVersionVisibleRotates } from '#app/models/design-artwork-version/design-artwork-version.server'
import { getLayerVisibleRotates } from '#app/models/design-layer/design-layer.server'
import { type ILayerWithChildren } from '#app/models/layer/layer.server'
import { type rotateBasisTypeEnum } from '#app/schema/rotate'

export const getRotates = async ({
	artworkVersionId,
	layerId,
	rotate,
}: {
	artworkVersionId?: IArtworkVersionWithChildren['id']
	layerId?: ILayerWithChildren['id']
	rotate: IDesignRotate
}) => {
	const allRotates = isArrayRotateBasisType(
		rotate.attributes.basis as rotateBasisTypeEnum,
	)

	if (allRotates) {
		if (artworkVersionId) {
			return await getArtworkVersionVisibleRotates({ artworkVersionId })
		} else if (layerId) {
			return await getLayerVisibleRotates({ layerId })
		}
	}
	return []
}
