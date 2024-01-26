import { prisma } from '#app/utils/db.server'

export const getArtboard = async (userId: string, artboardId: string) => {
	const artboard = await prisma.artboard.findFirst({
		where: { slug: artboardId, ownerId: userId },
		select: {
			id: true,
			slug: true,
			owner: { select: { username: true } },
			layers: {
				select: {
					layerId: true,
				},
			},
		},
	})
	return artboard
}

export const getLayers = async (userId: string) => {
	const layers = await prisma.layer.findMany({
		where: { ownerId: userId },
		select: {
			id: true,
			name: true,
			slug: true,
			owner: { select: { username: true } },
		},
		orderBy: { updatedAt: 'desc' },
	})
	return layers
}
