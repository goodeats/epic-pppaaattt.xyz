import { prisma } from '#app/utils/db.server'

export const getArtwork = async (userId: string, artworkId: string) => {
	const artwork = await prisma.artwork.findFirst({
		where: { slug: artworkId, ownerId: userId },
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
	return artwork
}
