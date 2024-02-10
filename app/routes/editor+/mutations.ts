import { prisma } from '#app/utils/db.server'

export const updateArtboardDimensions = async (
	userId: string,
	artboardId: string | undefined,
	width: number,
	height: number,
) => {
	return await prisma.artboard.update({
		select: { id: true },
		where: { id: artboardId, ownerId: userId },
		data: {
			width,
			height,
		},
	})
}

export const updateArtboardBackgroundColor = async (
	userId: string,
	artboardId: string | undefined,
	backgroundColor: string,
) => {
	return await prisma.artboard.update({
		select: { id: true },
		where: { id: artboardId, ownerId: userId },
		data: {
			backgroundColor,
		},
	})
}

export const updateArtboardAppearancesAdd = async (
	userId: string,
	artboardId: string,
	appearanceIds: string[],
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

		// Get existing appearances on the artboard
		const existingArtboardAppearances =
			await prisma.appearancesOnArtboards.findMany({
				where: { artboardId },
				select: { appearanceId: true, order: true },
				orderBy: { order: 'asc' },
			})
		const existingArtboardAppearanceIds = existingArtboardAppearances.map(
			({ appearanceId }) => appearanceId,
		)

		// Determine new and appearances to remove
		const appearancesToAdd = verifiedAppearanceIds.filter(
			id => !existingArtboardAppearanceIds.includes(id),
		)
		const appearancesToRemove = existingArtboardAppearanceIds.filter(
			id => !verifiedAppearanceIds.includes(id),
		)

		// Calculate the starting index for new appearances
		const maxOrder =
			existingArtboardAppearances.length > 0
				? existingArtboardAppearances[existingArtboardAppearances.length - 1]
						.order
				: -1
		let newAppearanceOrderStart = maxOrder + 1 - appearancesToRemove.length

		// Add new appearances to the artboard
		const addAppearancesPromises = appearancesToAdd.map(appearanceId => {
			return prisma.appearancesOnArtboards.create({
				data: { artboardId, appearanceId, order: newAppearanceOrderStart++ },
			})
		})

		// Remove unchecked appearances from the artboard
		const removeAppearancesPromise = appearancesToRemove.map(appearanceId => {
			return prisma.appearancesOnArtboards.deleteMany({
				where: { artboardId, appearanceId },
			})
		})

		// Update order for remaining appearances
		const updateOrderPromises = existingArtboardAppearances
			.filter(({ appearanceId }) => !appearancesToRemove.includes(appearanceId))
			.map((appearance, index) => {
				return prisma.appearancesOnArtboards.updateMany({
					where: { artboardId, appearanceId: appearance.appearanceId },
					data: { order: index },
				})
			})

		// Execute all operations
		await Promise.all([
			...addAppearancesPromises,
			...removeAppearancesPromise,
			...updateOrderPromises,
		])

		// Return the updated artboard
		return await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
	})
}

export const addArtboardAppearances = async (
	userId: string,
	artboardId: string,
	appearanceIds: string[],
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

		// Get existing appearances on the artboard
		const existingArtboardAppearances =
			await prisma.appearancesOnArtboards.findMany({
				where: { artboardId },
				select: { appearanceId: true, order: true },
				orderBy: { order: 'asc' },
			})
		const existingArtboardAppearanceIds = existingArtboardAppearances.map(
			({ appearanceId }) => appearanceId,
		)

		// Determine new appearances to add
		const appearancesToAdd = verifiedAppearanceIds.filter(
			id => !existingArtboardAppearanceIds.includes(id),
		)

		// Calculate the starting index for new appearances
		const maxOrder =
			existingArtboardAppearances.length > 0
				? existingArtboardAppearances[existingArtboardAppearances.length - 1]
						.order
				: -1
		let newAppearanceOrderStart = maxOrder + 1

		// Add new appearances to the artboard
		const addAppearancesPromises = appearancesToAdd.map(appearanceId => {
			return prisma.appearancesOnArtboards.create({
				data: { artboardId, appearanceId, order: newAppearanceOrderStart++ },
			})
		})

		// Update order for remaining appearances
		const updateOrderPromises = existingArtboardAppearances.map(
			(appearance, index) => {
				return prisma.appearancesOnArtboards.updateMany({
					where: { artboardId, appearanceId: appearance.appearanceId },
					data: { order: index },
				})
			},
		)

		// Execute all operations
		await Promise.all([...addAppearancesPromises, ...updateOrderPromises])

		// Return the updated artboard
		return await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
	})
}

export const removeArtboardAppearance = async (
	userId: string,
	artboardId: string,
	appearanceId: string,
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

		// Get existing appearances on the artboard
		const existingArtboardAppearances =
			await prisma.appearancesOnArtboards.findMany({
				where: { artboardId },
				select: { appearanceId: true, order: true },
				orderBy: { order: 'asc' },
			})

		// remove appearance from the artboard
		await prisma.appearancesOnArtboards.deleteMany({
			where: { artboardId, appearanceId },
		})

		// Update order for remaining appearances
		const updateOrderPromises = existingArtboardAppearances.map(
			(appearance, index) => {
				return prisma.appearancesOnArtboards.updateMany({
					where: { artboardId, appearanceId: appearance.appearanceId },
					data: { order: index },
				})
			},
		)

		// Execute all operations
		await Promise.all([...updateOrderPromises])

		// Return the updated artboard
		return await prisma.artboard.findFirst({
			where: { id: artboardId, ownerId: userId },
			select: { id: true, slug: true, owner: { select: { username: true } } },
		})
	})
}
