import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { findFirstLayer, type ILayer } from '#app/models/layer/layer.server'
import {
	deselectArtboardVersionLayers,
	updateLayerSelected,
} from '#app/models/layer-artboard-version/layer-artboard-version.update.server'
import { type IUser } from '#app/models/user/user.server'
import { prisma } from '#app/utils/db.server'

export const artboardVersionLayerSelectService = async ({
	userId,
	id,
	artboardVersionId,
}: {
	userId: IUser['id']
	id: ILayer['id']
	artboardVersionId: IArtboardVersion['id']
}) => {
	try {
		const promises = []
		// Step 1: get the layer
		const layer = await getLayer({ id, userId })
		const { selected } = layer

		// Step 2: deselect all layers in the artboard version
		const deselectLayersPromise = deselectArtboardVersionLayers({
			artboardVersionId,
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
		console.log('artboardVersionLayerSelectService error:', error)
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
