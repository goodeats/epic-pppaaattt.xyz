import { type User } from '@prisma/client'
import { type IArtboard } from '#app/models/artboard.server'
import {
	updateDesignVisible,
	type IDesign,
	findFirstDesign,
} from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { artboardUpdateSelectedDesignService } from './update-selected.service'

export const artboardDesignToggleVisibleService = async ({
	userId,
	id,
	artboardId,
	updateSelectedDesignId,
}: {
	userId: User['id']
	id: IDesign['id']
	artboardId: IArtboard['id']
	updateSelectedDesignId: string | null
}) => {
	try {
		// Step 1: get the design
		const design = await getDesign({ id, userId })
		const { visible } = design
		const type = design.type as designTypeEnum

		// Step 2: update the design visible state
		const toggleDesignVisiblePromise = updateDesignVisible({
			id,
			visible: !visible,
		})
		await prisma.$transaction([toggleDesignVisiblePromise])

		// Step 3: update the selected design for its type, if necessary
		// visibility is more complicated than just going by the current design state
		// look for selectedDesignToUpdateOnToggleVisible in design utils
		await artboardUpdateSelectedDesignService({
			artboardId,
			designId: updateSelectedDesignId,
			type,
		})

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const getDesign = async ({
	id,
	userId,
}: {
	id: IDesign['id']
	userId: User['id']
}) => {
	const design = await findFirstDesign({
		where: { id, ownerId: userId },
	})

	if (!design) throw new Error(`Design not found: ${id}`)

	return design
}
