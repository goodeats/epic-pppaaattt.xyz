import { type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { type IArtworkVersion } from '../artwork-version/artwork-version.server'
import { type IDesign } from '../design/design.server'

export const findFirstVisibleArtworkVersionDesignByType = async ({
	artworkVersionId,
	type,
}: {
	artworkVersionId: IArtworkVersion['id']
	type: designTypeEnum
}): Promise<IDesign | null> => {
	const designs = await prisma.design.findMany({
		where: { artworkVersionId, type },
	})
	const orderedDesigns = orderLinkedItems<IDesign>(designs)
	return orderedDesigns.find(design => design.visible) || null
}
