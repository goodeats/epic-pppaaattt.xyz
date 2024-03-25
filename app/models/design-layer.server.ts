import { type Design } from '@prisma/client'
import { type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { type IDesign } from './design.server'
import { type ILayer } from './layer.server'

export interface IDesignWithLayer extends IDesign {
	layer: ILayer
}

export const findFirstVisibleLayerDesign = async ({
	layerId,
	type,
}: {
	layerId: ILayer['id']
	type: designTypeEnum
}): Promise<IDesign | null> => {
	return await prisma.design.findFirst({
		where: { layerId, type, visible: true },
	})
}

export const updateLayerSelectedDesign = ({
	layerId,
	designId,
	type,
}: {
	layerId: ILayer['id']
	designId: Design['id']
	type: designTypeEnum
}) => {
	const unselectDesign = prisma.design.updateMany({
		where: { layerId, type, selected: true },
		data: { selected: false },
	})
	const selectDesign = prisma.design.update({
		where: { id: designId },
		data: { selected: true },
	})
	return [unselectDesign, selectDesign]
}
