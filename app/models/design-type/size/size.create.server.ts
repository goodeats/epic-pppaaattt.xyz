import {
	type IDesign,
	type IDesignTypeCreateOverrides,
} from '#app/models/design/design.server'
import { SizeDataSchema } from '#app/schema/size'
import { prisma } from '#app/utils/db.server'

export interface ISizeCreateOverrides {
	format?: string
	value?: number
	basis?: string
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
