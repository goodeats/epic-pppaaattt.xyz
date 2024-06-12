import { invariant } from '@epic-web/invariant'
import { AssetTypeEnum } from '#app/schema/asset'
import { parseAssetImageAttributes } from '#app/utils/asset/image'
import { prisma } from '#app/utils/db.server'
import { type IAssetImageSrc, type IAssetImage } from './image.server'

export const getAssetImageArtwork = async ({
	id,
}: {
	id: IAssetImage['id']
}): Promise<IAssetImageSrc | null> => {
	const image = await prisma.asset.findUnique({
		where: {
			id,
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
