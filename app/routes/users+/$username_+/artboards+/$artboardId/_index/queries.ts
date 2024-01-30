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
			layers: {
				select: {
					order: true,
					isVisible: true,
					layer: {
						select: {
							name: true,
							description: true,
							slug: true,
							updatedAt: true,
						},
					},
				},
				orderBy: {
					order: 'asc',
				},
			},
			appearances: {
				select: {
					order: true,
					isVisible: true,
					overrideValue: true,
					appearance: {
						select: {
							name: true,
							description: true,
							slug: true,
							type: true,
							value: true,
							updatedAt: true,
						},
					},
				},
				orderBy: {
					order: 'asc',
				},
			},
		},
	})
	return artboard
}
