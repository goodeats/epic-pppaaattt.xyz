import { prisma } from '#app/utils/db.server'
import { type IDesign } from '../design.server'

export interface IDesignDeletedResponse {
	success: boolean
	message?: string
}

export const deleteDesign = ({ id }: { id: IDesign['id'] }) => {
	return prisma.design.delete({
		where: { id },
	})
}
