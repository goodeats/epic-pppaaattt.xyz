import { type Design } from '@prisma/client'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { filterVisibleDesigns } from '#app/utils/design'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { filterNonArrayRotates } from '#app/utils/rotate'
import { type IArtboard } from './artboard.server'
import {
	findManyDesignsWithType,
	type IDesignWithPalette,
	type IDesign,
	type IDesignWithRotate,
} from './design.server'
import { type IPalette } from './palette.server'
import { type IRotate } from './rotate.server'

export interface IDesignWithArtboard extends IDesign {
	artboard: IArtboard
}

export const findFirstVisibleArtboardDesignByType = async ({
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
	const deselectDesign = deselectArtboardSelectedDesign({
		artboardId,
		type,
	})
	const selectDesign = prisma.design.update({
		where: { id: designId },
		data: { selected: true },
	})
	return [deselectDesign, selectDesign]
}

export const deselectArtboardSelectedDesign = ({
	artboardId,
	type,
}: {
	artboardId: IArtboard['id']
	type: designTypeEnum
}) => {
	return prisma.design.updateMany({
		where: { artboardId, type, selected: true },
		data: { selected: false },
	})
}

export const getArtboardVisiblePalettes = async ({
	artboardId,
}: {
	artboardId: IArtboard['id']
}): Promise<IPalette[]> => {
	const designPalettes = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.PALETTE, artboardId },
	})) as IDesignWithPalette[]

	const visibleDesignPalettes = filterVisibleDesigns(
		orderLinkedItems<IDesignWithPalette>(designPalettes),
	) as IDesignWithPalette[]

	return visibleDesignPalettes.map(design => design.palette)
}

export const getArtboardVisibleRotates = async ({
	artboardId,
}: {
	artboardId: IArtboard['id']
}): Promise<IRotate[]> => {
	const designRotates = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.ROTATE, artboardId },
	})) as IDesignWithRotate[]

	const visibleDesignRotates = filterVisibleDesigns(
		orderLinkedItems<IDesignWithRotate>(designRotates),
	) as IDesignWithRotate[]

	return filterNonArrayRotates(
		visibleDesignRotates.map(design => design.rotate),
	)
}
