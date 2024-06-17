import { prisma } from '#app/utils/db.server'
import { type IDesignLayout } from './layout.server'

export interface IDesignLayoutDeletedResponse {
	success: boolean
	message?: string
}

export const deleteDesignLayout = ({ id }: { id: IDesignLayout['id'] }) => {
	return prisma.design.delete({
		where: { id },
	})
}
