import { artboardUpdateSelectedDesignPromise } from '#app/models/artboard.server'
import { type designTypeEnum } from '#app/schema/design'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'

export const artboardDesignToggleVisibleService = async ({
	id,
	artboardId,
	updateSelectedDesignId,
}: {
	id: string
	artboardId: string
	updateSelectedDesignId: string | null
}) => {
	try {
		await prisma.$transaction(async prisma => {
			const design = await prisma.design.findFirst({
				where: { id },
			})
			if (!design) throw new Error('Design not found')
			const { visible, type } = design

			const updateOperations = [
				toggleVisibleDesignPromise({ id, visible, prisma }),
			]

			// update the artboard selected design for its type
			// either replace or remove
			const artboardUpdatePromises = await artboardUpdateSelectedDesignPromise({
				artboardId,
				updateSelectedDesignId,
				type: type as designTypeEnum,
				prisma,
			})
			// typescript seems to be gaslighting me here
			// the operation succeeds and the args seem valid
			// spent a couple hours (on delete service) trying to figure out why and choosing to ignore it
			// will monitor if something weird ever happens
			// @ts-ignore
			updateOperations.push(...artboardUpdatePromises)

			// Execute all update operations in parallel
			await Promise.all(updateOperations)
		})

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

// toggle visibility of design
const toggleVisibleDesignPromise = ({
	id,
	visible,
	prisma,
}: {
	id: string
	visible: boolean
	prisma: PrismaTransactionType
}) => {
	return prisma.design.update({
		where: { id },
		data: { visible: !visible },
	})
}
