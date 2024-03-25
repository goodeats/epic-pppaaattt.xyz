import { StrokeDataSchema } from '#app/schema/stroke'
import { prisma } from '#app/utils/db.server'
import {
	type IDesign,
	type IDesignTypeCreateOverrides,
	type IDesignWithStroke,
	type IDesignWithType,
} from './design.server'

export interface IStroke {
	id: string
	style: string
	value: string
	basis: string
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export interface IStrokeCreateOverrides {
	style?: string
	value?: string
	basis?: string
}

export const findStrokeInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): IStroke | undefined => {
	const design = designs.find(design => design.stroke) as IDesignWithStroke

	return design.stroke
}

export const createDesignStroke = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const fillData = {
		designId,
		...(designTypeOverrides as IStrokeCreateOverrides),
	}
	const data = StrokeDataSchema.parse(fillData)

	return prisma.stroke.create({ data })
}
