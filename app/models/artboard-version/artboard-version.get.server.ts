import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import {
	type IArtboardVersionWithDesignsAndLayers,
	type IArtboardVersion,
} from './artboard-version.server'

export type queryArtboardVersionWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	slug: z.string().optional(),
})

const includeDesigns = {
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
const includeDesignsAndLayers = {
	designs: {
		include: includeDesigns,
	},
	layers: {
		include: {
			designs: {
				include: includeDesigns,
			},
		},
	},
}

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const validateQueryWhereArgsPresent = (
	where: queryArtboardVersionWhereArgsType,
) => {
	const nullValuesAllowed: string[] = []
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

export const getArtboardVersionWithDesignsAndLayers = async ({
	where,
}: {
	where: queryArtboardVersionWhereArgsType
}): Promise<IArtboardVersionWithDesignsAndLayers | null> => {
	validateQueryWhereArgsPresent(where)
	const artboardVersion = await prisma.artboardVersion.findFirst({
		where,
		include: includeDesignsAndLayers,
	})
	return artboardVersion
}
