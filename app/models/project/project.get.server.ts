import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import { type IProjectWithArtboards } from './project.server'

export type queryWhereArgsType = z.infer<typeof queryWhereArgs>
const queryWhereArgs = z.object({
	id: z.string().optional(),
	ownerId: z.string().optional(),
})

export const getProjectsWithArtboards = async ({
	where,
}: {
	where: queryWhereArgsType
}): Promise<IProjectWithArtboards[]> => {
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
