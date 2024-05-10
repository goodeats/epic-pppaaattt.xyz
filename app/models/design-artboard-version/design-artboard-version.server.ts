import { type Design } from '@prisma/client'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { filterVisibleDesigns } from '#app/utils/design'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { filterNonArrayRotates } from '#app/utils/rotate'
import { type IArtboardVersion } from '../artboard-version/artboard-version.server'
import {
	findManyDesignsWithType,
	type IDesignWithPalette,
	type IDesign,
	type IDesignWithRotate,
} from '../design/design.server'
import { type IPalette } from '../design-type/palette/palette.server'
import { type IRotate } from '../design-type/rotate/rotate.server'

export interface IDesignWithArtboardVersion extends IDesign {
	artboardVersion: IArtboardVersion
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

export const getArtboardVersionVisiblePalettes = async ({
	artboardVersionId,
}: {
	artboardVersionId: IArtboardVersion['id']
}): Promise<IPalette[]> => {
	const designPalettes = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.PALETTE, artboardVersionId },
	})) as IDesignWithPalette[]

	const visibleDesignPalettes = filterVisibleDesigns(
		orderLinkedItems<IDesignWithPalette>(designPalettes),
	) as IDesignWithPalette[]

	return visibleDesignPalettes.map(design => design.palette)
}

export const getArtboardVersionVisibleRotates = async ({
	artboardVersionId,
}: {
	artboardVersionId: IArtboardVersion['id']
}): Promise<IRotate[]> => {
	const designRotates = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.ROTATE, artboardVersionId },
	})) as IDesignWithRotate[]

	const visibleDesignRotates = filterVisibleDesigns(
		orderLinkedItems<IDesignWithRotate>(designRotates),
	) as IDesignWithRotate[]

	return filterNonArrayRotates(
		visibleDesignRotates.map(design => design.rotate),
	)
}
