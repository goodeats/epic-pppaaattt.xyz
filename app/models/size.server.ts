import { SizeDataSchema } from '#app/schema/size'
import { prisma } from '#app/utils/db.server'
import {
	type IDesign,
	type IDesignTypeCreateOverrides,
	type IDesignWithSize,
	type IDesignWithType,
} from './design.server'

export interface ISize {
	id: string
	format: string
	value: number
	basis: string
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export interface ISizeCreateOverrides {
	format?: string
	value?: number
	basis?: string
}

export const findSizeInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): ISize | null => {
	const design = designs.find(design => design.size) as IDesignWithSize

	return design?.size || null
}

export const createDesignSize = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const sizeData = {
		designId,
		...(designTypeOverrides as ISizeCreateOverrides),
	}
	const data = SizeDataSchema.parse(sizeData)

	return prisma.size.create({ data })
}
