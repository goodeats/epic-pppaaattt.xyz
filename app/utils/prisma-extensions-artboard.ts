import { Prisma } from '@prisma/client'
import { type whereArgsType } from '#app/schema/artboard'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const ArtboardPrismaExtensions = Prisma.defineExtension({
	result: {
		artboard: {
			save: {
				needs: { id: true },
				compute(artboard) {
					return () => {
						return prismaExtended.artboard.update({
							where: { id: artboard.id },
							data: artboard,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.artboard.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedArtboard = Prisma.Result<
	typeof prismaExtended.artboard,
	any,
	'findFirstOrThrow'
>

export const findFirstArtboardInstance = async ({
	where,
}: {
	where: whereArgsType
}): Promise<ExtendedArtboard | null> => {
	return await prismaExtended.artboard.findFirst({
		where,
	})
}
