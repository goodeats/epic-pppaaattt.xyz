import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import { type IUserBasic } from './user.server'

export type queryWhereArgsType = z.infer<typeof queryWhereArgs>
const queryWhereArgs = z.object({
	id: z.string().optional(),
	username: z.string().optional(),
})

export const getUserBasic = async ({
	where,
}: {
	where: queryWhereArgsType
}): Promise<IUserBasic | null> => {
	const user = await prisma.user.findFirst({
		where,
		select: {
			id: true,
			username: true,
			name: true,
			image: { select: { id: true } },
		},
	})

	if (!user) return null

	// set image id to null if image is not found
	const image = user.image ? { id: user.image.id } : { id: null }

	return {
		...user,
		image,
	}
}
