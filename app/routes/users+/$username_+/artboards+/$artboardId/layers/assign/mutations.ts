import { prisma } from '#app/utils/db.server'

export const addLayersToArtboard = async (
	userId: string,
	artboardId: string,
	layerIds: string[],
) => {
	// Start a transaction
	return await prisma.$transaction(async prisma => {
		// get artboard
		const artboard = await await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
		if (!artboard) {
			throw new Error('Artboard not found')
		}

		// Verify layers exist and belong to the user
		const verifiedLayers = await prisma.layer.findMany({
			where: { ownerId: userId, id: { in: layerIds } },
			select: {
				id: true,
				name: true,
				slug: true,
				owner: { select: { username: true } },
			},
		})
		const verifiedLayerIds = verifiedLayers.map(layer => layer.id)

		// Get existing layers on the artboard
		const existingArtboardLayers = await prisma.layersOnArtboards.findMany({
			where: { artboardId },
			select: { layerId: true, order: true },
			orderBy: { order: 'asc' },
		})
		const existingArtboardLayerIds = existingArtboardLayers.map(
			({ layerId }) => layerId,
		)

		// Determine new and layers to remove
		const layersToAdd = verifiedLayerIds.filter(
			id => !existingArtboardLayerIds.includes(id),
		)
		const layersToRemove = existingArtboardLayerIds.filter(
			id => !verifiedLayerIds.includes(id),
		)

		// Calculate the starting index for new layers
		const maxOrder =
			existingArtboardLayers.length > 0
				? existingArtboardLayers[existingArtboardLayers.length - 1].order
				: -1
		let newLayerOrderStart = maxOrder + 1 - layersToRemove.length

		// Add new layers to the artboard
		const addLayersPromises = layersToAdd.map(layerId => {
			return prisma.layersOnArtboards.create({
				data: { artboardId, layerId, order: newLayerOrderStart++ },
			})
		})

		// Remove unchecked layers from the artboard
		const removeLayersPromise = layersToRemove.map(layerId => {
			return prisma.layersOnArtboards.deleteMany({
				where: { artboardId, layerId },
			})
		})

		// Update order for remaining layers
		const updateOrderPromises = existingArtboardLayers
			.filter(({ layerId }) => !layersToRemove.includes(layerId))
			.map((layer, index) => {
				return prisma.layersOnArtboards.updateMany({
					where: { artboardId, layerId: layer.layerId },
					data: { order: index },
				})
			})

		// Execute all operations
		await Promise.all([
			...addLayersPromises,
			...removeLayersPromise,
			...updateOrderPromises,
		])

		// Return the updated artboard
		return await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
	})
}
