import { FillDataSchema } from '#app/schema/fill'
import { prisma } from '#app/utils/db.server'
import {
	type IDesign,
	type IDesignTypeCreateOverrides,
	type IDesignWithFill,
	type IDesignWithType,
} from './design.server'

export interface IFill {
	id: string
	style: string
	value: string
	basis: string
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export interface IFillCreateOverrides {
	style?: string
	value?: string
	basis?: string
}

export const findFillInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): IFill | undefined => {
	const design = designs.find(design => design.fill) as IDesignWithFill

	return design.fill
}

export const createDesignFill = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const fillData = {
		designId,
		...(designTypeOverrides as IFillCreateOverrides),
	}
	const data = FillDataSchema.parse(fillData)

	return prisma.fill.create({ data })
}
