import { RotateDataSchema } from '#app/schema/rotate'
import { prisma } from '#app/utils/db.server'
import {
	type IDesign,
	type IDesignTypeCreateOverrides,
	type IDesignWithRotate,
	type IDesignWithType,
} from './design.server'

export interface IRotate {
	id: string
	rotation: number
	basis: string
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export interface IRotateCreateOverrides {
	rotation?: number
	basis?: string
}

export const findRotateInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): IRotate | undefined => {
	const design = designs.find(design => design.rotate) as IDesignWithRotate

	return design.rotate
}

export const createDesignRotate = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const fillData = {
		designId,
		...(designTypeOverrides as IRotateCreateOverrides),
	}
	const data = RotateDataSchema.parse(fillData)

	return prisma.rotate.create({ data })
}
