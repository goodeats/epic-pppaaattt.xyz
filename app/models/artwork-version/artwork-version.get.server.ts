import { z } from 'zod'
import { zodStringOrNull } from '#app/schema/zod-helpers'
import { prisma } from '#app/utils/db.server'
import {
	type IArtworkVersionWithDesignsAndLayers,
	type IArtworkVersion,
} from './artwork-version.server'

export type queryArtworkVersionWhereArgsType = z.infer<typeof whereArgs>
const whereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	slug: z.string().optional(),
	branchId: z.string().optional(),
	nextId: zodStringOrNull.optional(),
	prevId: zodStringOrNull.optional(),
	starred: z.boolean().optional(),
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
	where: queryArtworkVersionWhereArgsType,
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
			'Null or undefined values are not allowed in query parameters for artwork version.',
		)
	}
}

export const getArtworkVersions = async ({
	where,
}: {
	where: queryArtworkVersionWhereArgsType
}): Promise<IArtworkVersion[]> => {
	validateQueryWhereArgsPresent(where)
	return await prisma.artworkVersion.findMany({
		where,
	})
}

export const getArtworkVersion = async ({
	where,
}: {
	where: queryArtworkVersionWhereArgsType
}): Promise<IArtworkVersion | null> => {
	validateQueryWhereArgsPresent(where)
	const artworkVersion = await prisma.artworkVersion.findFirst({
		where,
	})
	return artworkVersion
}

export const getArtworkVersionWithDesignsAndLayers = async ({
	where,
}: {
	where: queryArtworkVersionWhereArgsType
}): Promise<IArtworkVersionWithDesignsAndLayers | null> => {
	validateQueryWhereArgsPresent(where)
	const artworkVersion = await prisma.artworkVersion.findFirst({
		where,
		include: includeDesignsAndLayers,
	})
	return artworkVersion
}

export const getStarredArtworkVersions = async ({
	artworkId,
}: {
	artworkId: string
}): Promise<IArtworkVersionWithDesignsAndLayers[]> => {
	const starredVersions = await prisma.artworkVersion.findMany({
		where: {
			branch: {
				artworkId: artworkId,
			},
			starred: true,
		},
		include: {
			...includeDesignsAndLayers,
			branch: true,
		},
		orderBy: {
			updatedAt: 'desc',
		},
	})
	return starredVersions
}
