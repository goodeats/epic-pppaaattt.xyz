import { invariant } from '@epic-web/invariant'
import { AssetTypeEnum } from '#app/schema/asset'
import { prisma } from '#app/utils/db.server'
import { type IAssetImageSrc, type IAssetImage } from './image.server'
import { parseAssetImageAttributes } from './utils'

// just return the minimum required data
// for loading the image from the route url
export const getAssetImageLayerSrc = async ({
	id,
	layerId,
	ownerId,
}: {
	id: IAssetImage['id']
	layerId: IAssetImage['layerId']
	ownerId: IAssetImage['ownerId']
}): Promise<IAssetImageSrc | null> => {
	const image = await prisma.asset.findUnique({
		where: {
			id,
			ownerId,
			layerId,
			type: AssetTypeEnum.IMAGE,
		},
		select: {
			attributes: true,
			blob: true,
		},
	})
	invariant(image, 'Asset Image Not found: ' + id)
	invariant(image.blob, 'Asset Image has no blob: ' + id)

	const attributes = parseAssetImageAttributes(image.attributes)

	return {
		contentType: attributes.contentType,
		blob: image.blob,
	}
}
