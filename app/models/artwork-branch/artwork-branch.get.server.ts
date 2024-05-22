import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import {
	type IArtworkBranch,
	type IArtworkBranchWithVersions,
} from './artwork-branch.server'

export type queryArtworkBranchWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	slug: z.string().optional(),
	artworkId: z.string().optional(),
})

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const validateQueryWhereArgsPresent = (
	where: queryArtworkBranchWhereArgsType,
) => {
	const nullValuesAllowed: string[] = ['nextId', 'prevId']
	const missingValues: Record<string, any> = {}
	for (const [key, value] of Object.entries(where)) {
		const valueIsNull = value === null || value === undefined
		const nullValueAllowed = nullValuesAllowed.includes(key)
		if (valueIsNull && !nullValueAllowed) {
			missingValues[key] = value
		}
	}

	if (Object.keys(missingValues).length > 0) {
		console.log('Missing values:', missingValues)
		throw new Error(
			'Null or undefined values are not allowed in query parameters for artwork branch.',
		)
	}
}

export const getArtworkBranch = async ({
	where,
}: {
	where: queryArtworkBranchWhereArgsType
}): Promise<IArtworkBranch | null> => {
	validateQueryWhereArgsPresent(where)
	const branch = await prisma.artworkBranch.findFirst({ where })
	return branch
}

export const getArtworkBranchWithVersions = async ({
	where,
}: {
	where: queryArtworkBranchWhereArgsType
}): Promise<IArtworkBranchWithVersions | null> => {
	validateQueryWhereArgsPresent(where)
	const artworkBranch = await prisma.artworkBranch.findFirst({
		where,
		include: {
			versions: {
				orderBy: {
					createdAt: 'desc',
				},
			},
		},
	})
	return artworkBranch
}
