import { prisma } from '#app/utils/db.server'

export const getLayer = async (userId: string, layerId: string) => {
	const layer = await prisma.layer.findFirst({
		where: { slug: layerId, ownerId: userId },
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
	return layer
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
