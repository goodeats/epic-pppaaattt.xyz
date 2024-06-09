import { Prisma } from '@prisma/client'
import { type whereArgsType } from '#app/schema/design'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const ArtworkImagePrismaExtensions = Prisma.defineExtension({
	result: {
		artworkImage: {
			save: {
				needs: { id: true },
				compute(artworkImage) {
					return () => {
						return prismaExtended.artworkImage.update({
							where: { id: artworkImage.id },
							data: artworkImage,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.artworkImage.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedArtworkImage = Prisma.Result<
	typeof prismaExtended.artworkImage,
	any,
	'findFirstOrThrow'
>

export const findFirstArtworkImageInstance = async ({
	where,
}: {
	where: whereArgsType
}): Promise<ExtendedArtworkImage | null> => {
	return await prismaExtended.artworkImage.findFirst({
		where,
	})
}
