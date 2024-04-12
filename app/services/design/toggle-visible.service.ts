import { type User } from '@prisma/client'
import {
	findFirstDesign,
	updateDesignVisible,
	type IDesign,
	type IDesignEntityId,
	type IDesignIdOrNull,
} from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { type IUpdateSelectedDesignStrategy } from '#app/strategies/design/update-selected.strategy'
import { prisma } from '#app/utils/db.server'
import { updateSelectedDesignService } from './update-selected.service'

export const designToggleVisibleService = async ({
	userId,
	id,
	targetEntityId,
	updateSelectedDesignId,
	updateSelectedDesignStrategy,
}: {
	userId: User['id']
	id: IDesign['id']
	targetEntityId: IDesignEntityId
	updateSelectedDesignId?: IDesignIdOrNull
	updateSelectedDesignStrategy: IUpdateSelectedDesignStrategy
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
		await updateSelectedDesignService({
			targetEntityId,
			designId: updateSelectedDesignId,
			type,
			strategy: updateSelectedDesignStrategy,
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
