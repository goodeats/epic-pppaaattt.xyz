import { type Design } from '@prisma/client'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { type IArtworkVersion } from '../artwork-version/artwork-version.server'
import { findManyDesignsWithType } from '../design/design.get.server'
import { type IDesign } from '../design/design.server'
import { type IDesignPalette } from '../design/palette/palette.server'
import { type IDesignRotate } from '../design/rotate/rotate.server'
import { filterDesignsVisible } from '../design/utils'

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
}): Promise<IDesignPalette[]> => {
	const designPalettes = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.PALETTE, artworkVersionId },
	})) as IDesignPalette[]

	const orderedPalettes = orderLinkedItems<IDesignPalette>(designPalettes)

	const visibleDesignPalettes = filterDesignsVisible({
		designs: orderedPalettes,
	}) as IDesignPalette[]

	return visibleDesignPalettes
}

export const getArtworkVersionVisibleRotates = async ({
	artworkVersionId,
}: {
	artworkVersionId: IArtworkVersion['id']
}): Promise<IDesignRotate[]> => {
	const designRotates = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.ROTATE, artworkVersionId },
	})) as IDesignRotate[]

	const orderedRotates = orderLinkedItems<IDesignRotate>(designRotates)

	const visibleDesignRotates = filterDesignsVisible({
		designs: orderedRotates,
	}) as IDesignRotate[]

	return visibleDesignRotates
}
