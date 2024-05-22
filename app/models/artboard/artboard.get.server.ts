import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import {
	type IArtboard,
	type IArtboardWithBranchesAndVersions,
} from '../artboard/artboard.server'

export type queryArtboardWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	slug: z.string().optional(),
})

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const validateQueryWhereArgsPresent = (where: queryArtboardWhereArgsType) => {
	if (Object.values(where).some(value => !value)) {
		throw new Error(
			'Null or undefined values are not allowed in query parameters for artboard.',
		)
	}
}

export const getArtboard = async ({
	where,
}: {
	where: queryArtboardWhereArgsType
}): Promise<IArtboard | null> => {
	validateQueryWhereArgsPresent(where)
	const artboard = await prisma.artboard.findFirst({
		where,
	})
	return artboard
}

export const getArtboardWithBranchesAndVersions = async ({
	where,
}: {
	where: queryArtboardWhereArgsType
}): Promise<IArtboardWithBranchesAndVersions | null> => {
	validateQueryWhereArgsPresent(where)
	const artboard = await prisma.artboard.findFirst({
		where,
		include: {
			branches: {
				include: {
					versions: true,
				},
			},
		},
	})
	return artboard
}
