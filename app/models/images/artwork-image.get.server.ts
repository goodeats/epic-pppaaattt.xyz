import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import { type IArtworkImage } from './artwork-image.server'

export type queryArtworkWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	artworkId: z.string().optional(),
})

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const validateQueryWhereArgsPresent = (where: queryArtworkWhereArgsType) => {
	if (Object.values(where).some(value => !value)) {
		throw new Error(
			'Null or undefined values are not allowed in query parameters for artwork.',
		)
	}
}

export const getArtworkImage = async ({
	where,
}: {
	where: queryArtworkWhereArgsType
}): Promise<IArtworkImage | null> => {
	validateQueryWhereArgsPresent(where)
	const artwork = await prisma.artworkImage.findFirst({
		where,
	})
	return artwork
}
