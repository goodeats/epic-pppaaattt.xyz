import { prisma } from '#app/utils/db.server'

export const getArtboard = async (userId: string, artboardId: string) => {
	const artboard = await prisma.artboard.findFirst({
		where: { slug: artboardId, ownerId: userId },
		select: {
			id: true,
			name: true,
			description: true,
			isVisible: true,
			slug: true,
			width: true,
			height: true,
			backgroundColor: true,
			ownerId: true,
			updatedAt: true,
			project: {
				select: {
					name: true,
					description: true,
					isVisible: true,
					slug: true,
					updatedAt: true,
				},
			},
		},
	})
	return artboard
}
