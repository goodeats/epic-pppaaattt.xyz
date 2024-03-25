import { type Design } from '@prisma/client'
import { type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { type IArtboard } from './artboard.server'
import { type IDesign } from './design.server'

export interface IDesignWithArtboard extends IDesign {
	artboard: IArtboard
}

export const findFirstVisibleArtboardDesign = async ({
	artboardId,
	type,
}: {
	artboardId: IArtboard['id']
	type: designTypeEnum
}): Promise<IDesign | null> => {
	return await prisma.design.findFirst({
		where: { artboardId, type, visible: true },
	})
}

export const updateArtboardSelectedDesign = ({
	artboardId,
	designId,
	type,
}: {
	artboardId: IArtboard['id']
	designId: Design['id']
	type: designTypeEnum
}) => {
	const unselectDesign = prisma.design.updateMany({
		where: { artboardId, type, selected: true },
		data: { selected: false },
	})
	const selectDesign = prisma.design.update({
		where: { id: designId },
		data: { selected: true },
	})
	return [unselectDesign, selectDesign]
}
