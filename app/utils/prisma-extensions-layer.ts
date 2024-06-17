import { Prisma } from '@prisma/client'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const LayerPrismaExtensions = Prisma.defineExtension({
	result: {
		layer: {
			save: {
				needs: { id: true },
				compute(layer) {
					return () => {
						return prismaExtended.layer.update({
							where: { id: layer.id },
							data: layer,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.layer.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedLayer = Prisma.Result<
	typeof prismaExtended.layer,
	any,
	'findFirstOrThrow'
>

export const findFirstLayerInstance = async ({
	where,
}: {
	where: { id: string }
}): Promise<ExtendedLayer | null> => {
	return await prismaExtended.layer.findFirst({
		where,
	})
}
