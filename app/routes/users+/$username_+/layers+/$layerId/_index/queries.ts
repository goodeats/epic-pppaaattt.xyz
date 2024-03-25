import { prisma } from '#app/utils/db.server'

export const getLayer = async (userId: string, layerId: string) => {
	const layer = await prisma.layer.findFirst({
		where: { slug: layerId, ownerId: userId },
		select: {
			id: true,
			name: true,
			description: true,
			slug: true,
			ownerId: true,
			updatedAt: true,
		},
	})
	return layer
}
