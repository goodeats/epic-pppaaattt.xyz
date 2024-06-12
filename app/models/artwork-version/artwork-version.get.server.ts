import { invariant } from '@epic-web/invariant'
import { z } from 'zod'
import { zodStringOrNull } from '#app/schema/zod-helpers'
import { deserializeAssets } from '#app/utils/asset'
import { prisma } from '#app/utils/db.server'
import {
	type IArtworkVersionWithDesignsAndLayers,
	type IArtworkVersion,
	type IArtworkVersionWithChildren,
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
const artworkVersionChildren = {
	assets: true,
	designs: {
		include: includeDesigns,
	},
	layers: {
		include: {
			assets: true,
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

export const getArtworkVersionWithChildren = async ({
	where,
}: {
	where: queryArtworkVersionWhereArgsType
}): Promise<IArtworkVersionWithChildren | null> => {
	validateQueryWhereArgsPresent(where)
	const artworkVersion = await prisma.artworkVersion.findFirst({
		where,
		include: artworkVersionChildren,
	})
	invariant(artworkVersion, 'Artwork Version not found')

	const validatedAssets = deserializeAssets({ assets: artworkVersion.assets })
	return { ...artworkVersion, assets: validatedAssets }
}

export const getStarredArtworkVersionsByArtworkId = async ({
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
			...artworkVersionChildren,
			branch: true,
		},
		orderBy: {
			updatedAt: 'desc',
		},
	})
	return starredVersions
}

export const getAllPublishedArtworkVersions = async (): Promise<
	IArtworkVersionWithDesignsAndLayers[]
> => {
	const starredVersions = await prisma.artworkVersion.findMany({
		where: {
			published: true,
		},
		include: artworkVersionChildren,
		orderBy: {
			publishedAt: 'desc',
		},
	})
	return starredVersions
}
