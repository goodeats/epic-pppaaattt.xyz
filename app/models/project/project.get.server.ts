import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import { type IProjectWithArtboards } from './project.server'

export type queryProjectWhereArgsType = z.infer<typeof queryWhereArgs>
const queryWhereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
	slug: z.string().optional(),
})

// TODO: Add schemas for each type of query and parse with zod
// aka if by id that should be present, if by slug that should be present
// owner id should be present unless admin (not set up yet)
const validateQueryWhereArgsPresent = (where: queryProjectWhereArgsType) => {
	if (Object.values(where).some(value => !value)) {
		throw new Error(
			'Null or undefined values are not allowed in query parameters for artboard.',
		)
	}
}

export const getProjectsWithArtboards = async ({
	where,
}: {
	where: queryProjectWhereArgsType
}): Promise<IProjectWithArtboards[]> => {
	validateQueryWhereArgsPresent(where)
	const projects = await prisma.project.findMany({
		where,
		include: {
			artboards: {
				orderBy: {
					createdAt: 'desc',
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	})
	return projects
}

export const getProjectWithArtboards = async ({
	where,
}: {
	where: queryProjectWhereArgsType
}): Promise<IProjectWithArtboards | null> => {
	validateQueryWhereArgsPresent(where)
	const project = await prisma.project.findFirst({
		where,
		include: {
			artboards: {
				orderBy: {
					createdAt: 'desc',
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	})
	return project
}
