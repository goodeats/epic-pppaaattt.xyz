import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import { type IArtboardWithDesignsAndLayers } from '../artboard.server'

export type queryArtboardWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	slug: z.string().optional(),
})

const designInclude = {
	palette: true,
	size: true,
	fill: true,
	stroke: true,
	line: true,
	rotate: true,
	layout: true,
	template: true,
}

// no ordering for now since these are linked lists
const commonInclude = {
	designs: {
		include: designInclude,
	},
	layers: {
		include: {
			designs: {
				include: designInclude,
			},
		},
	},
}

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

export const getArtboardsWithDesignsAndLayers = async ({
	where,
}: {
	where: queryArtboardWhereArgsType
}): Promise<IArtboardWithDesignsAndLayers[]> => {
	validateQueryWhereArgsPresent(where)
	const artboards = await prisma.artboard.findMany({
		where,
		include: commonInclude,
	})
	return artboards
}

export const getArtboardWithDesignsAndLayers = async ({
	where,
}: {
	where: queryArtboardWhereArgsType
}): Promise<IArtboardWithDesignsAndLayers | null> => {
	validateQueryWhereArgsPresent(where)
	const artboard = await prisma.artboard.findFirst({
		where,
		include: commonInclude,
	})
	return artboard
}
