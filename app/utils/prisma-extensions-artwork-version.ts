import { Prisma } from '@prisma/client'
import { type whereArgsType } from '#app/schema/artwork'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const ArtworkVersionPrismaExtensions = Prisma.defineExtension({
	result: {
		artworkVersion: {
			save: {
				needs: { id: true },
				compute(artworkVersion) {
					return () => {
						return prismaExtended.artworkVersion.update({
							where: { id: artworkVersion.id },
							data: artworkVersion,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.artworkVersion.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedArtworkVersion = Prisma.Result<
	typeof prismaExtended.artworkVersion,
	any,
	'findFirstOrThrow'
>

export const findFirstArtworkVersionInstance = async ({
	where,
}: {
	where: whereArgsType
}): Promise<ExtendedArtworkVersion | null> => {
	return await prismaExtended.artworkVersion.findFirst({
		where,
	})
}
