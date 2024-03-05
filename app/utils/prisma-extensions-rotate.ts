import { Prisma } from '@prisma/client'
import { type whereArgsType } from '#app/schema/design'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const RotatePrismaExtensions = Prisma.defineExtension({
	result: {
		rotate: {
			save: {
				needs: { id: true },
				compute(rotate) {
					return () => {
						return prismaExtended.rotate.update({
							where: { id: rotate.id },
							data: rotate,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.rotate.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedRotate = Prisma.Result<
	typeof prismaExtended.rotate,
	any,
	'findFirstOrThrow'
>

export const findFirstRotateInstance = async ({
	where,
}: {
	where: whereArgsType
}): Promise<ExtendedRotate | null> => {
	return await prismaExtended.rotate.findFirst({
		where,
	})
}
