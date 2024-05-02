import { prisma } from '#app/utils/db.server'
import { type IArtboard } from '../artboard.server'
import { type IArtboardBranchWithVersions } from './artboard-branch.server'

export const createDefaultArtboardBranchWithVersion = async ({
	artboard,
}: {
	artboard: IArtboard
}): Promise<IArtboardBranchWithVersions> => {
	const { ownerId } = artboard

	const artboardBranch = await prisma.artboardBranch.create({
		data: {
			artboard: {
				connect: {
					id: artboard.id,
				},
			},
			owner: {
				connect: {
					id: ownerId,
				},
			},
			default: true,
			versions: {
				create: {
					owner: {
						connect: {
							id: ownerId,
						},
					},
				},
			},
		},
		include: {
			versions: true,
		},
	})
	return artboardBranch
}
