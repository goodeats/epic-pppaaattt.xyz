import { type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { type IArtboardVersion } from '../artboard-version/artboard-version.server'
import { type IDesign } from '../design.server'

export const findFirstVisibleArtboardVersionDesignByType = async ({
	artboardVersionId,
	type,
}: {
	artboardVersionId: IArtboardVersion['id']
	type: designTypeEnum
}): Promise<IDesign | null> => {
	const designs = await prisma.design.findMany({
		where: { artboardVersionId, type },
	})
	const orderedDesigns = orderLinkedItems<IDesign>(designs)
	return orderedDesigns.find(design => design.visible) || null
}
