import { prisma } from '#app/utils/db.server'
import { type IDesign } from '../design/design.server'

export interface IDesignUpdatedResponse {
	success: boolean
	message?: string
	updatedDesign?: IDesign
}

export const updateDesignVisible = ({
	id,
	visible,
}: {
	id: IDesign['id']
	visible: boolean
}) => {
	return prisma.design.update({
		where: { id },
		data: { visible },
	})
}
