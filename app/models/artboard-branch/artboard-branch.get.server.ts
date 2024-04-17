import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import { type IArtboardBranchWithVersions } from './artboard-branch.server'

export type queryArtboardBranchWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	slug: z.string().optional(),
})

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const validateQueryWhereArgsPresent = (
	where: queryArtboardBranchWhereArgsType,
) => {
	if (Object.values(where).some(value => !value)) {
		throw new Error(
			'Null or undefined values are not allowed in query parameters for artboard branch.',
		)
	}
}

export const getArtboardBranchWithVersions = async ({
	where,
}: {
	where: queryArtboardBranchWhereArgsType
}): Promise<IArtboardBranchWithVersions | null> => {
	validateQueryWhereArgsPresent(where)
	const artboardBranch = await prisma.artboardBranch.findFirst({
		where,
		include: {
			versions: {
				where: {
					latest: true,
				},
				take: 1,
			},
		},
	})
	return artboardBranch
}
