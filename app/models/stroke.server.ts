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
}): IStroke | null => {
	const design = designs.find(design => design.stroke) as IDesignWithStroke

	return design?.stroke || null
}

export const createDesignStroke = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const strokeData = {
		designId,
		...(designTypeOverrides as IStrokeCreateOverrides),
	}
	const data = StrokeDataSchema.parse(strokeData)

	return prisma.stroke.create({ data })
}
