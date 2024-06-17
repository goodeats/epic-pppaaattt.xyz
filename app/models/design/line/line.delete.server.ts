import { prisma } from '#app/utils/db.server'
import { type IDesignLine } from './line.server'

export interface IDesignLineDeletedResponse {
	success: boolean
	message?: string
}

export const deleteDesignLine = ({ id }: { id: IDesignLine['id'] }) => {
	return prisma.design.delete({
		where: { id },
	})
}
