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
	value: number
	basis: string
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export interface IRotateCreateOverrides {
	value?: number
	basis?: string
}

export const findRotateInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): IRotate | null => {
	const design = designs.find(design => design.rotate) as IDesignWithRotate

	return design?.rotate || null
}

export const createDesignRotate = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const rotateData = {
		designId,
		...(designTypeOverrides as IRotateCreateOverrides),
	}
	const data = RotateDataSchema.parse(rotateData)

	return prisma.rotate.create({ data })
}
