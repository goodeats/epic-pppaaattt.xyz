import { prisma } from '#app/utils/db.server'

export const assignAppearancesToLayer = async (
	userId: string,
	layerId: string,
	appearanceIds: string[],
) => {
	// Start a transaction
	return await prisma.$transaction(async prisma => {
		// get layer
		const layer = await await prisma.layer.findFirst({
			where: { id: layerId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
		if (!layer) {
			throw new Error('Layer not found')
		}

		// Verify appearances exist and belong to the user
		const verifiedAppearances = await prisma.appearance.findMany({
			where: { ownerId: userId, id: { in: appearanceIds } },
			select: {
				id: true,
				name: true,
				slug: true,
				owner: { select: { username: true } },
			},
		})
		const verifiedAppearanceIds = verifiedAppearances.map(
			appearance => appearance.id,
		)

		// Get existing appearances on the layer
		const existingLayerAppearances = await prisma.appearancesOnLayers.findMany({
			where: { layerId },
			select: { appearanceId: true, order: true },
			orderBy: { order: 'asc' },
		})
		const existingLayerAppearanceIds = existingLayerAppearances.map(
			({ appearanceId }) => appearanceId,
		)

		// Determine new and appearances to remove
		const appearancesToAdd = verifiedAppearanceIds.filter(
			id => !existingLayerAppearanceIds.includes(id),
		)
		const appearancesToRemove = existingLayerAppearanceIds.filter(
			id => !verifiedAppearanceIds.includes(id),
		)

		// Calculate the starting index for new appearances
		const maxOrder =
			existingLayerAppearances.length > 0
				? existingLayerAppearances[existingLayerAppearances.length - 1].order
				: -1
		let newAppearanceOrderStart = maxOrder + 1 - appearancesToRemove.length

		// Add new appearances to the layer
		const addAppearancesPromises = appearancesToAdd.map(appearanceId => {
			return prisma.appearancesOnLayers.create({
				data: { layerId, appearanceId, order: newAppearanceOrderStart++ },
			})
		})

		// Remove unchecked appearances from the layer
		const removeAppearancesPromise = appearancesToRemove.map(appearanceId => {
			return prisma.appearancesOnLayers.deleteMany({
				where: { layerId, appearanceId },
			})
		})

		// Update order for remaining appearances
		const updateOrderPromises = existingLayerAppearances
			.filter(({ appearanceId }) => !appearancesToRemove.includes(appearanceId))
			.map((appearance, index) => {
				return prisma.appearancesOnLayers.updateMany({
					where: { layerId, appearanceId: appearance.appearanceId },
					data: { order: index },
				})
			})

		// Execute all operations
		await Promise.all([
			...addAppearancesPromises,
			...removeAppearancesPromise,
			...updateOrderPromises,
		])

		// Return the updated layer
		return await prisma.layer.findFirst({
			where: { id: layerId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
	})
}
