import { type Design } from '@prisma/client'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { findManyDesignsWithType } from '../design/design.get.server'
import { type IDesign } from '../design/design.server'
import { type IDesignPalette } from '../design/palette/palette.server'
import { type IDesignRotate } from '../design/rotate/rotate.server'
import { filterDesignsVisible } from '../design/utils'
import { type ILayer } from '../layer/layer.server'

export interface IDesignWithLayer extends IDesign {
	layer: ILayer
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
	const deselectDesign = deselectLayerSelectedDesign({
		layerId,
		type,
	})
	const selectDesign = prisma.design.update({
		where: { id: designId },
		data: { selected: true },
	})
	return [deselectDesign, selectDesign]
}

export const deselectLayerSelectedDesign = ({
	layerId,
	type,
}: {
	layerId: ILayer['id']
	type: designTypeEnum
}) => {
	return prisma.design.updateMany({
		where: { layerId, type, selected: true },
		data: { selected: false },
	})
}

export const getLayerVisiblePalettes = async ({
	layerId,
}: {
	layerId: ILayer['id']
}): Promise<IDesignPalette[]> => {
	const designPalettes = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.PALETTE, layerId },
	})) as IDesignPalette[]

	const orderedPalettes = orderLinkedItems<IDesignPalette>(designPalettes)

	const visibleDesignPalettes = filterDesignsVisible({
		designs: orderedPalettes,
	}) as IDesignPalette[]

	return visibleDesignPalettes
}

export const getLayerVisibleRotates = async ({
	layerId,
}: {
	layerId: ILayer['id']
}): Promise<IDesignRotate[]> => {
	const designRotates = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.ROTATE, layerId },
	})) as IDesignRotate[]

	const orderedRotates = orderLinkedItems<IDesignRotate>(designRotates)

	const visibleDesignRotates = filterDesignsVisible({
		designs: orderedRotates,
	}) as IDesignRotate[]

	return visibleDesignRotates
}
