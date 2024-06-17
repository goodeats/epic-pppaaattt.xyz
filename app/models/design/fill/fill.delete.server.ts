import { prisma } from '#app/utils/db.server'
import { type IDesignFill } from './fill.server'

export interface IDesignFillDeletedResponse {
	success: boolean
	message?: string
}

export const deleteDesignFill = ({ id }: { id: IDesignFill['id'] }) => {
	return prisma.design.delete({
		where: { id },
	})
}
