import { Prisma } from '@prisma/client'
import { type whereArgsType } from '#app/schema/design'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const LinePrismaExtensions = Prisma.defineExtension({
	result: {
		line: {
			save: {
				needs: { id: true },
				compute(line) {
					return () => {
						return prismaExtended.line.update({
							where: { id: line.id },
							data: line,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.line.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedLine = Prisma.Result<
	typeof prismaExtended.line,
	any,
	'findFirstOrThrow'
>

export const findFirstLineInstance = async ({
	where,
}: {
	where: whereArgsType
}): Promise<ExtendedLine | null> => {
	return await prismaExtended.line.findFirst({
		where,
	})
}
