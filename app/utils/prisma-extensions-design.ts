import { Prisma } from '@prisma/client'
import { designSchema, type whereArgsType } from '#app/schema/design'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const DesignPrismaQueryExtensions = Prisma.defineExtension({
	query: {
		design: {
			create({ args, query }) {
				args.data = designSchema.parse(args.data)
				return query(args)
			},
		},
	},
})

export const DesignPrismaExtensions = Prisma.defineExtension({
	result: {
		design: {
			save: {
				needs: { id: true },
				compute(design) {
					return () => {
						return prismaExtended.design.update({
							where: { id: design.id },
							data: design,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.design.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedDesign = Prisma.Result<
	typeof prismaExtended.design,
	any,
	'findFirstOrThrow'
>

export const findFirstDesignInstance = async ({
	where,
}: {
	where: whereArgsType
}): Promise<ExtendedDesign | null> => {
	return await prismaExtended.design.findFirst({
		where,
	})
}
