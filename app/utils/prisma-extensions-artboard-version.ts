import { Prisma } from '@prisma/client'
import { type whereArgsType } from '#app/schema/artboard'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const ArtboardVersionPrismaExtensions = Prisma.defineExtension({
	result: {
		artboardVersion: {
			save: {
				needs: { id: true },
				compute(artboardVersion) {
					return () => {
						return prismaExtended.artboardVersion.update({
							where: { id: artboardVersion.id },
							data: artboardVersion,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.artboardVersion.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedArtboardVersion = Prisma.Result<
	typeof prismaExtended.artboardVersion,
	any,
	'findFirstOrThrow'
>

export const findFirstArtboardVersionInstance = async ({
	where,
}: {
	where: whereArgsType
}): Promise<ExtendedArtboardVersion | null> => {
	return await prismaExtended.artboardVersion.findFirst({
		where,
	})
}
