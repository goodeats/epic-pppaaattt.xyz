import { type Design } from '@prisma/client'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { filterVisibleDesigns } from '#app/utils/design'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { filterNonArrayRotates } from '#app/utils/rotate'
import { type IArtworkVersion } from '../artwork-version/artwork-version.server'
import {
	findManyDesignsWithType,
	type IDesignWithPalette,
	type IDesign,
	type IDesignWithRotate,
} from '../design/design.server'
import { type IPalette } from '../design-type/palette/palette.server'
import { type IRotate } from '../design-type/rotate/rotate.server'

export interface IDesignWithArtworkVersion extends IDesign {
	artworkVersion: IArtworkVersion
}

export const updateArtworkVersionSelectedDesign = ({
	artworkVersionId,
	designId,
	type,
}: {
	artworkVersionId: IArtworkVersion['id']
	designId: Design['id']
	type: designTypeEnum
}) => {
	const deselectDesign = deselectArtworkVersionSelectedDesign({
		artworkVersionId,
		type,
	})
	const selectDesign = prisma.design.update({
		where: { id: designId },
		data: { selected: true },
	})
	return [deselectDesign, selectDesign]
}

export const deselectArtworkVersionSelectedDesign = ({
	artworkVersionId,
	type,
}: {
	artworkVersionId: IArtworkVersion['id']
	type: designTypeEnum
}) => {
	return prisma.design.updateMany({
		where: { artworkVersionId, type, selected: true },
		data: { selected: false },
	})
}

export const getArtworkVersionVisiblePalettes = async ({
	artworkVersionId,
}: {
	artworkVersionId: IArtworkVersion['id']
}): Promise<IPalette[]> => {
	const designPalettes = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.PALETTE, artworkVersionId },
	})) as IDesignWithPalette[]

	const visibleDesignPalettes = filterVisibleDesigns(
		orderLinkedItems<IDesignWithPalette>(designPalettes),
	) as IDesignWithPalette[]

	return visibleDesignPalettes.map(design => design.palette)
}

export const getArtworkVersionVisibleRotates = async ({
	artworkVersionId,
}: {
	artworkVersionId: IArtworkVersion['id']
}): Promise<IRotate[]> => {
	const designRotates = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.ROTATE, artworkVersionId },
	})) as IDesignWithRotate[]

	const visibleDesignRotates = filterVisibleDesigns(
		orderLinkedItems<IDesignWithRotate>(designRotates),
	) as IDesignWithRotate[]

	return filterNonArrayRotates(
		visibleDesignRotates.map(design => design.rotate),
	)
}
