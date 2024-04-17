import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import { type IArtboardVersion } from '../artboard-version.server'

export type queryArtboardVersionWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	slug: z.string().optional(),
})

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const validateQueryWhereArgsPresent = (
	where: queryArtboardVersionWhereArgsType,
) => {
	if (Object.values(where).some(value => !value)) {
		throw new Error(
			'Null or undefined values are not allowed in query parameters for artboard version.',
		)
	}
}

export const getArtboardVersion = async ({
	where,
}: {
	where: queryArtboardVersionWhereArgsType
}): Promise<IArtboardVersion | null> => {
	validateQueryWhereArgsPresent(where)
	const artboardVersion = await prisma.artboardVersion.findFirst({
		where,
	})
	return artboardVersion
}
