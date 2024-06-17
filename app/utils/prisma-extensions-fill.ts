import { Prisma } from '@prisma/client'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const FillPrismaExtensions = Prisma.defineExtension({
	result: {
		fill: {
			save: {
				needs: { id: true },
				compute(fill) {
					return () => {
						return prismaExtended.fill.update({
							where: { id: fill.id },
							data: fill,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.fill.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedFill = Prisma.Result<
	typeof prismaExtended.fill,
	any,
	'findFirstOrThrow'
>

export const findFirstFillInstance = async ({
	where,
}: {
	where: { id: string }
}): Promise<ExtendedFill | null> => {
	return await prismaExtended.fill.findFirst({
		where,
	})
}
