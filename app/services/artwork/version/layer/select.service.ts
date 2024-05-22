import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { findFirstLayer, type ILayer } from '#app/models/layer/layer.server'
import {
	deselectArtworkVersionLayers,
	updateLayerSelected,
} from '#app/models/layer-artwork-version/layer-artwork-version.update.server'
import { type IUser } from '#app/models/user/user.server'
import { prisma } from '#app/utils/db.server'

export const artworkVersionLayerSelectService = async ({
	userId,
	id,
	artworkVersionId,
}: {
	userId: IUser['id']
	id: ILayer['id']
	artworkVersionId: IArtworkVersion['id']
}) => {
	try {
		const promises = []
		// Step 1: get the layer
		const layer = await getLayer({ id, userId })
		const { selected } = layer

		// Step 2: deselect all layers in the artwork version
		const deselectLayersPromise = deselectArtworkVersionLayers({
			artworkVersionId,
		})
		promises.push(deselectLayersPromise)

		// Step 3: select the layer if currently not selected
		if (!selected) {
			const selectLayerPromise = updateLayerSelected({
				id,
				selected: !selected,
			})
			promises.push(selectLayerPromise)
		}

		await prisma.$transaction(promises)

		return { success: true }
	} catch (error) {
		console.log('artworkVersionLayerSelectService error:', error)
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
