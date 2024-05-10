import { type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { type IDesign } from '../design/design.server'
import { type ILayer } from '../layer/layer.server'

export const findFirstVisibleLayerDesignByType = async ({
	layerId,
	type,
}: {
	layerId: ILayer['id']
	type: designTypeEnum
}): Promise<IDesign | null> => {
	const designs = await prisma.design.findMany({
		where: { layerId, type },
	})
	const orderedDesigns = orderLinkedItems<IDesign>(designs)
	return orderedDesigns.find(design => design.visible) || null
}
