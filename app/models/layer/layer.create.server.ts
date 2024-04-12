import { prisma } from '#app/utils/db.server'
import { type ILayer } from '../layer.server'

export interface ILayerCreatedResponse {
	success: boolean
	message?: string
	createdLayer?: ILayer
}

export const createLayer = async ({
	data,
}: {
	data: {
		ownerId: string
		name: string
		artboardId?: string
		artboardVersionId?: string
		description?: string | undefined
		slug?: string | undefined
		visible?: boolean
	}
}): Promise<ILayer> => {
	return await prisma.layer.create({ data })
}
