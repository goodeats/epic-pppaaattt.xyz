import { prisma } from '#app/utils/db.server'
import { type IAssetImage } from './image.server'

export interface IAssetImageDeletedResponse {
	success: boolean
	message?: string
}

export const deleteAssetImage = ({ id }: { id: IAssetImage['id'] }) => {
	return prisma.asset.delete({
		where: { id },
	})
}
