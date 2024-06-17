import { Prisma } from '@prisma/client'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const SizePrismaExtensions = Prisma.defineExtension({
	result: {
		size: {
			save: {
				needs: { id: true },
				compute(size) {
					return () => {
						return prismaExtended.size.update({
							where: { id: size.id },
							data: size,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.size.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedSize = Prisma.Result<
	typeof prismaExtended.size,
	any,
	'findFirstOrThrow'
>

export const findFirstSizeInstance = async ({
	where,
}: {
	where: { id: string }
}): Promise<ExtendedSize | null> => {
	return await prismaExtended.size.findFirst({
		where,
	})
}
