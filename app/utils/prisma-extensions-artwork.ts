import { Prisma } from '@prisma/client'
import { type whereArgsType } from '#app/schema/artwork'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const ArtworkPrismaExtensions = Prisma.defineExtension({
	result: {
		artwork: {
			save: {
				needs: { id: true },
				compute(artwork) {
					return () => {
						return prismaExtended.artwork.update({
							where: { id: artwork.id },
							data: artwork,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.artwork.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedArtwork = Prisma.Result<
	typeof prismaExtended.artwork,
	any,
	'findFirstOrThrow'
>

export const findFirstArtworkInstance = async ({
	where,
}: {
	where: whereArgsType
}): Promise<ExtendedArtwork | null> => {
	return await prismaExtended.artwork.findFirst({
		where,
	})
}
