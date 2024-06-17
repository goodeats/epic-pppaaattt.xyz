import { type Design } from '@prisma/client'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { filterVisibleDesigns } from '#app/utils/design'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { filterNonArrayRotates } from '#app/utils/rotate'
import { findManyDesignsWithType } from '../design/design.get.server'
import {
	type IDesignWithPalette,
	type IDesign,
	type IDesignWithRotate,
} from '../design/design.server'
import { type IPalette } from '../design-type/palette/palette.server'
import { type IRotate } from '../design-type/rotate/rotate.server'
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
}): Promise<IPalette[]> => {
	const designPalettes = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.PALETTE, layerId },
	})) as IDesignWithPalette[]

	const visibleDesignPalettes = filterVisibleDesigns(
		orderLinkedItems<IDesignWithPalette>(designPalettes),
	) as IDesignWithPalette[]

	return visibleDesignPalettes.map(design => design.palette)
}

export const getLayerVisibleRotates = async ({
	layerId,
}: {
	layerId: ILayer['id']
}): Promise<IRotate[]> => {
	const designRotates = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.ROTATE, layerId },
	})) as IDesignWithRotate[]

	const visibleDesignRotates = filterVisibleDesigns(
		orderLinkedItems<IDesignWithRotate>(designRotates),
	) as IDesignWithRotate[]

	return filterNonArrayRotates(
		visibleDesignRotates.map(design => design.rotate),
	)
}
