import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import {
	type IArtboard,
	type IArtboardWithBranchesAndVersions,
	type IArtboardWithDesignsAndLayers,
} from '../artboard.server'

export type queryArtboardWhereArgsType = z.infer<typeof whereArgs>
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
		include: includeDesignsAndLayers,
		orderBy: {
			createdAt: 'asc',
		},
	})
	return artboards
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

export const getArtboardWithDesignsAndLayers = async ({
	where,
}: {
	where: queryArtboardWhereArgsType
}): Promise<IArtboardWithDesignsAndLayers | null> => {
	validateQueryWhereArgsPresent(where)
	const artboard = await prisma.artboard.findFirst({
		where,
		include: includeDesignsAndLayers,
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
