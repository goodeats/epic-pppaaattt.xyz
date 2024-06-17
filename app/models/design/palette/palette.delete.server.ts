import { prisma } from '#app/utils/db.server'
import { type IDesignPalette } from './palette.server'

export interface IDesignPaletteDeletedResponse {
	success: boolean
	message?: string
}

export const deleteDesignPalette = ({ id }: { id: IDesignPalette['id'] }) => {
	return prisma.design.delete({
		where: { id },
	})
}
