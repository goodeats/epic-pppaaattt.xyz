import { Prisma } from '@prisma/client'
import { type whereArgsType } from '#app/schema/design'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const LayoutPrismaExtensions = Prisma.defineExtension({
	result: {
		layout: {
			save: {
				needs: { id: true },
				compute(layout) {
					return () => {
						return prismaExtended.layout.update({
							where: { id: layout.id },
							data: layout,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.layout.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedLayout = Prisma.Result<
	typeof prismaExtended.layout,
	any,
	'findFirstOrThrow'
>

export const findFirstLayoutInstance = async ({
	where,
}: {
	where: whereArgsType
}): Promise<ExtendedLayout | null> => {
	return await prismaExtended.layout.findFirst({
		where,
	})
}
