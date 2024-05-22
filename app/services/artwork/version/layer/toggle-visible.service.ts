import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import {
	findFirstLayer,
	updateLayerVisible,
	type ILayer,
} from '#app/models/layer/layer.server'
import { type IUser } from '#app/models/user/user.server'
import { prisma } from '#app/utils/db.server'

export const artworkVersionLayerToggleVisibleService = async ({
	userId,
	id,
	artworkVersionId,
}: {
	userId: IUser['id']
	id: ILayer['id']
	artworkVersionId: IArtworkVersion['id']
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
		console.log('artworkVersionLayerToggleVisibleService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

const getLayer = async ({
	id,
	userId,
}: {
	id: ILayer['id']
	userId: IUser['id']
}) => {
	const layer = await findFirstLayer({
		where: { id, ownerId: userId },
	})

	if (!layer) throw new Error(`Layer not found: ${id}`)

	return layer
}
