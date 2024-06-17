import { prisma } from '#app/utils/db.server'
import { type IDesignRotate } from './rotate.server'

export interface IDesignRotateDeletedResponse {
	success: boolean
	message?: string
}

export const deleteDesignRotate = ({ id }: { id: IDesignRotate['id'] }) => {
	return prisma.design.delete({
		where: { id },
	})
}
