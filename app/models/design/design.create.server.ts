import { prisma } from '#app/utils/db.server'
import { type IDesign } from '../design.server'

export interface IDesignCreatedResponse {
	success: boolean
	message?: string
	createdDesign?: IDesign
}

export const createDesign = async ({
	data,
}: {
	data: {
		ownerId: string
		type: string
		artboardId?: string
		artboardVersionId?: string
		layerId?: string
		visible?: boolean
		selected?: boolean
	}
}): Promise<IDesign> => {
	const createdDesign = await prisma.design.create({ data })
	return createdDesign
}
