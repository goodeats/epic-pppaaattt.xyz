import { type whereArgsType } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'

export interface IDesignWithType {
	id: string
	type: string
	createdAt: Date | string
	ownerId: string
	artboardId: string | null
	palette: IPalette | null
}

export interface IPalette {
	id: string
	format: string
	value: string
	opacity: number
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export const findManyDesignsWithType = async ({
	where,
}: {
	where: whereArgsType
}) => {
	const designs = await prisma.design.findMany({
		where,
		include: {
			palette: true,
		},
		orderBy: {
			type: 'asc',
		},
	})
	return designs
}
