import { LineDataSchema } from '#app/schema/line'
import { prisma } from '#app/utils/db.server'
import {
	type IDesign,
	type IDesignTypeCreateOverrides,
	type IDesignWithLine,
	type IDesignWithType,
} from './design.server'

export interface ILine {
	id: string
	width: number
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export interface ILineCreateOverrides {
	width?: number
}

export const findLineInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): ILine | undefined => {
	const design = designs.find(design => design.line) as IDesignWithLine

	return design.line
}

export const createDesignLine = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const lineData = {
		designId,
		...(designTypeOverrides as ILineCreateOverrides),
	}
	const data = LineDataSchema.parse(lineData)

	return prisma.line.create({ data })
}
