import { Prisma } from '@prisma/client'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const PalettePrismaExtensions = Prisma.defineExtension({
	result: {
		palette: {
			save: {
				needs: { id: true },
				compute(palette) {
					return () => {
						return prismaExtended.palette.update({
							where: { id: palette.id },
							data: palette,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.palette.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedPalette = Prisma.Result<
	typeof prismaExtended.palette,
	any,
	'findFirstOrThrow'
>

export const findFirstPaletteInstance = async ({
	where,
}: {
	where: { id: string }
}): Promise<ExtendedPalette | null> => {
	return await prismaExtended.palette.findFirst({
		where,
	})
}
