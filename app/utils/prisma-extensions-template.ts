import { Prisma } from '@prisma/client'
import { prismaExtended } from './db.server'

// must be in /utils to actually connect to prisma

// just do extended when you want to .save() or .delete()
// this has to be in /utils to actually connect to prisma

// instance methods .save() and .delete()
// https://github.com/prisma/prisma-client-extensions/blob/main/instance-methods/script.ts

export const TemplatePrismaExtensions = Prisma.defineExtension({
	result: {
		template: {
			save: {
				needs: { id: true },
				compute(template) {
					return () => {
						return prismaExtended.template.update({
							where: { id: template.id },
							data: template,
						})
					}
				},
			},

			delete: {
				needs: { id: true },
				compute({ id }) {
					return () => {
						return prismaExtended.template.delete({
							where: { id },
						})
					}
				},
			},
		},
	},
})

// https://github.com/prisma/docs/issues/5058#issuecomment-1636473141
export type ExtendedTemplate = Prisma.Result<
	typeof prismaExtended.template,
	any,
	'findFirstOrThrow'
>

export const findFirstTemplateInstance = async ({
	where,
}: {
	where: { id: string }
}): Promise<ExtendedTemplate | null> => {
	return await prismaExtended.template.findFirst({
		where,
	})
}
