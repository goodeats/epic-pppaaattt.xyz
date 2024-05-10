import {
	type IDesign,
	type IDesignTypeCreateOverrides,
} from '#app/models/design/design.server'
import { LayoutDataSchema } from '#app/schema/layout'
import { prisma } from '#app/utils/db.server'

export interface ILayoutCreateOverrides {
	style?: string
	count?: number
	rows?: number
	columns?: number
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
