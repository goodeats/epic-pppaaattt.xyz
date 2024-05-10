import {
	type IDesign,
	type IDesignTypeCreateOverrides,
} from '#app/models/design/design.server'
import { StrokeDataSchema } from '#app/schema/stroke'
import { prisma } from '#app/utils/db.server'

export interface IStrokeCreateOverrides {
	style?: string
	value?: string
	basis?: string
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
