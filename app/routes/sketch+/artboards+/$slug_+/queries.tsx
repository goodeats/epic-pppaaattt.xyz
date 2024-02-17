import { prisma } from '#app/utils/db.server'

export const getOwner = async (userId: string) => {
	return await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			image: { select: { id: true } },
			artboards: { select: { id: true, slug: true, name: true } },
		},
		where: { id: userId },
	})
}

export const getArtboard = async (userId: string, slug: string) => {
	return await prisma.artboard.findFirst({
		where: { slug: slug, ownerId: userId },
		select: {
			id: true,
			name: true,
			description: true,
			slug: true,
			width: true,
			height: true,
			backgroundColor: true,
			updatedAt: true,
			project: {
				select: {
					id: true,
					name: true,
					slug: true,
				},
			},
		},
	})
}
