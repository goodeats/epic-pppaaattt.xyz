import { type Design } from '@prisma/client'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { filterVisibleDesigns, orderLinkedDesigns } from '#app/utils/design'
import { filterNonArrayRotates } from '#app/utils/rotate'
import { type IArtboardVersion } from './artboard-version.server'
import {
	findManyDesignsWithType,
	type IDesignWithPalette,
	type IDesign,
	type IDesignWithRotate,
} from './design.server'
import { type IPalette } from './palette.server'
import { type IRotate } from './rotate.server'

export interface IDesignWithArtboardVersion extends IDesign {
	artboardVersion: IArtboardVersion
}

export const findFirstVisibleArtboardVersionDesignByType = async ({
	artboardVersionId,
	type,
}: {
	artboardVersionId: IArtboardVersion['id']
	type: designTypeEnum
}): Promise<IDesign | null> => {
	return await prisma.design.findFirst({
		where: { artboardVersionId, type, visible: true },
	})
}

export const updateArtboardVersionSelectedDesign = ({
	artboardVersionId,
	designId,
	type,
}: {
	artboardVersionId: IArtboardVersion['id']
	designId: Design['id']
	type: designTypeEnum
}) => {
	const deselectDesign = deselectArtboardVersionSelectedDesign({
		artboardVersionId,
		type,
	})
	const selectDesign = prisma.design.update({
		where: { id: designId },
		data: { selected: true },
	})
	return [deselectDesign, selectDesign]
}

export const deselectArtboardVersionSelectedDesign = ({
	artboardVersionId,
	type,
}: {
	artboardVersionId: IArtboardVersion['id']
	type: designTypeEnum
}) => {
	return prisma.design.updateMany({
		where: { artboardVersionId, type, selected: true },
		data: { selected: false },
	})
}

export const getArtboardVisiblePalettes = async ({
	artboardVersionId,
}: {
	artboardVersionId: IArtboardVersion['id']
}): Promise<IPalette[]> => {
	const designPalettes = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.PALETTE, artboardVersionId },
	})) as IDesignWithPalette[]

	const visibleDesignPalettes = filterVisibleDesigns(
		orderLinkedDesigns(designPalettes),
	) as IDesignWithPalette[]

	return visibleDesignPalettes.map(design => design.palette)
}

export const getArtboardVisibleRotates = async ({
	artboardVersionId,
}: {
	artboardVersionId: IArtboardVersion['id']
}): Promise<IRotate[]> => {
	const designRotates = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.ROTATE, artboardVersionId },
	})) as IDesignWithRotate[]

	const visibleDesignRotates = filterVisibleDesigns(
		orderLinkedDesigns(designRotates),
	) as IDesignWithRotate[]

	return filterNonArrayRotates(
		visibleDesignRotates.map(design => design.rotate),
	)
}
