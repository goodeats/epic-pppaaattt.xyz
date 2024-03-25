import { LayoutDataSchema } from '#app/schema/layout'
import { prisma } from '#app/utils/db.server'
import {
	type IDesign,
	type IDesignTypeCreateOverrides,
	type IDesignWithLayout,
	type IDesignWithType,
} from './design.server'

export interface ILayout {
	id: string
	style: string
	count: number
	rows: number
	columns: number
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export interface ILayoutCreateOverrides {
	style?: string
	count?: number
	rows?: number
	columns?: number
}

export const findLayoutInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): ILayout | null => {
	const design = designs.find(design => design.layout) as IDesignWithLayout

	return design?.layout || null
}

export const createDesignLayout = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const layoutData = {
		designId,
		...(designTypeOverrides as ILayoutCreateOverrides),
	}
	const data = LayoutDataSchema.parse(layoutData)

	return prisma.layout.create({ data })
}
