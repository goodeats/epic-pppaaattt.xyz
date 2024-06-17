import { prisma } from '#app/utils/db.server'
import { type IDesignTemplate } from './template.server'

export interface IDesignTemplateDeletedResponse {
	success: boolean
	message?: string
}

export const deleteDesignTemplate = ({ id }: { id: IDesignTemplate['id'] }) => {
	return prisma.design.delete({
		where: { id },
	})
}
