import { Prisma } from '@prisma/client'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const StrokePrismaExtensions = Prisma.defineExtension({
	result: {
		stroke: {
			save: {
				needs: { id: true },
				compute(stroke) {
					return () => {
						return prismaExtended.stroke.update({
							where: { id: stroke.id },
							data: stroke,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.stroke.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedStroke = Prisma.Result<
	typeof prismaExtended.stroke,
	any,
	'findFirstOrThrow'
>

export const findFirstStrokeInstance = async ({
	where,
}: {
	where: { id: string }
}): Promise<ExtendedStroke | null> => {
	return await prismaExtended.stroke.findFirst({
		where,
	})
}
