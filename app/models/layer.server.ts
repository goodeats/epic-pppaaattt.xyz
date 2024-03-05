import { type whereArgsType } from '#app/schema/layer'
import { prisma } from '#app/utils/db.server'

export interface ILayer {
	id: string
	name: string
	description: string | null
	slug: string | null
	visible: boolean
	createdAt: Date | string
	updatedAt: Date | string
	ownerId: string
	artboardId: string | null
	nextId: string | null
	prevId: string | null
	parentId: string | null
	// children: ILayer[]
	// designs: IDesignWithType[]
}

export const findManyLayers = async ({ where }: { where: whereArgsType }) => {
	const layers = await prisma.layer.findMany({
		where,
		// include: {
		// 	designs: true,
		// 	children: true,
		// },
	})
	return layers
}
