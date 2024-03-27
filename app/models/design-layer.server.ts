import { type Design } from '@prisma/client'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { filterVisibleDesigns, orderLinkedDesigns } from '#app/utils/design'
import { filterNonArrayRotates } from '#app/utils/rotate'
import {
	findManyDesignsWithType,
	type IDesignWithPalette,
	type IDesign,
	type IDesignWithRotate,
} from './design.server'
import { type ILayer } from './layer.server'
import { type IPalette } from './palette.server'
import { type IRotate } from './rotate.server'

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

export const getLayerVisiblePalettes = async ({
	layerId,
}: {
	layerId: ILayer['id']
}): Promise<IPalette[]> => {
	const designPalettes = (await findManyDesignsWithType({
		where: { type: DesignTypeEnum.PALETTE, layerId },
	})) as IDesignWithPalette[]

	const visibleDesignPalettes = filterVisibleDesigns(
		orderLinkedDesigns(designPalettes),
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
		orderLinkedDesigns(designRotates),
	) as IDesignWithRotate[]

	return filterNonArrayRotates(
		visibleDesignRotates.map(design => design.rotate),
	)
}
