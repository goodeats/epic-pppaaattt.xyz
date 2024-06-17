import { prisma } from '#app/utils/db.server'
import { type IDesignStroke } from './stroke.server'

export interface IDesignStrokeDeletedResponse {
	success: boolean
	message?: string
}

export const deleteDesignStroke = ({ id }: { id: IDesignStroke['id'] }) => {
	return prisma.design.delete({
		where: { id },
	})
}
