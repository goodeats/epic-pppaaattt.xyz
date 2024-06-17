import { prisma } from '#app/utils/db.server'
import { type IDesignSize } from './size.server'

export interface IDesignSizeDeletedResponse {
	success: boolean
	message?: string
}

export const deleteDesignSize = ({ id }: { id: IDesignSize['id'] }) => {
	return prisma.design.delete({
		where: { id },
	})
}
