import { prisma } from '#app/utils/db.server'

export const getArtboard = async (userId: string, artboardId: string) => {
	const artboard = await prisma.artboard.findFirst({
		where: { slug: artboardId, ownerId: userId },
		select: {
			id: true,
			slug: true,
			owner: { select: { username: true } },
			appearances: {
				select: {
					appearanceId: true,
				},
			},
		},
	})
	return artboard
}

export const getAppearances = async (userId: string) => {
	const appearances = await prisma.appearance.findMany({
		where: { ownerId: userId },
		select: {
			id: true,
			name: true,
			slug: true,
			type: true,
			owner: { select: { username: true } },
		},
		orderBy: { updatedAt: 'asc' },
	})
	return appearances
}
