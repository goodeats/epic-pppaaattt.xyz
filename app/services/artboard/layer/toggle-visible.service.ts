import { type User } from '@prisma/client'
import { type IArtboard } from '#app/models/artboard/artboard.server'
import {
	findFirstLayer,
	updateLayerVisible,
	type ILayer,
} from '#app/models/layer/layer.server'
import { prisma } from '#app/utils/db.server'

export const artboardLayerToggleVisibleService = async ({
	userId,
	id,
	artboardId,
}: {
	userId: User['id']
	id: ILayer['id']
	artboardId: IArtboard['id']
}) => {
	try {
		// Step 1: get the design
		const layer = await getLayer({ id, userId })
		const { visible } = layer

		// Step 2: update the design visible state
		const toggleLayerVisiblePromise = updateLayerVisible({
			id,
			visible: !visible,
		})
		await prisma.$transaction([toggleLayerVisiblePromise])

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const getLayer = async ({
	id,
	userId,
}: {
	id: ILayer['id']
	userId: User['id']
}) => {
	const layer = await findFirstLayer({
		where: { id, ownerId: userId },
	})

	if (!layer) throw new Error(`Layer not found: ${id}`)

	return layer
}
