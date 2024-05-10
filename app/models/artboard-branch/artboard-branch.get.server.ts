import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import {
	type IArtboardBranch,
	type IArtboardBranchWithVersions,
} from './artboard-branch.server'

export type queryArtboardBranchWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	slug: z.string().optional(),
	artboardId: z.string().optional(),
})

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const validateQueryWhereArgsPresent = (
	where: queryArtboardBranchWhereArgsType,
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
			'Null or undefined values are not allowed in query parameters for artboard branch.',
		)
	}
}

export const getArtboardBranch = async ({
	where,
}: {
	where: queryArtboardBranchWhereArgsType
}): Promise<IArtboardBranch | null> => {
	validateQueryWhereArgsPresent(where)
	const branch = await prisma.artboardBranch.findFirst({ where })
	return branch
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
				orderBy: {
					createdAt: 'desc',
				},
			},
		},
	})
	return artboardBranch
}
