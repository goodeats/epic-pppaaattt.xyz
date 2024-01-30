import { prisma } from '#app/utils/db.server'

export const updateArtboardDimensions = async (
	userId: string,
	artboardId: string | undefined,
	width: number,
	height: number,
) => {
	return await prisma.artboard.update({
		select: { id: true },
		where: { id: artboardId, ownerId: userId },
		data: {
			width,
			height,
		},
	})
}

export const updateArtboardBackgroundColor = async (
	userId: string,
	artboardId: string | undefined,
	backgroundColor: string,
) => {
	return await prisma.artboard.update({
		select: { id: true },
		where: { id: artboardId, ownerId: userId },
		data: {
			backgroundColor,
		},
	})
}
