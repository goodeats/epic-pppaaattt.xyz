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

export const getArtboardsWithDesignsAndLayers = async ({
	where,
}: {
	where: queryArtboardWhereArgsType
}): Promise<IArtboardWithDesignsAndLayers[]> => {
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
	const artboard = await prisma.artboard.findFirst({
		where,
		include: commonInclude,
	})
	return artboard
}
