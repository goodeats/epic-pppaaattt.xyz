import { prisma } from '#app/utils/db.server'

export const addLayersToArtboard = async (
	userId: string,
	artboardId: string,
	layerIds: string[],
) => {
	console.log('hererere')
	console.log('userId', userId)
	console.log('artboardId', artboardId)
	console.log('layerIds', layerIds)
	// get artboard
	const artboard = await getArtboard(userId, artboardId)
	if (!artboard) {
		return null
	}
	console.log('theere')

	// get layers, make sure they all exist and belong to the user
	const layers = await getLayers(userId, layerIds)
	// take their ids
	const verifiedLayerIds = layers.map(({ id }) => id)
	console.log('verifiedLayerIds: ', verifiedLayerIds)

	// find layers that already exist on the artboard
	const artboardLayerIds = await getCurrentLayersOnArtboard(artboard.id)
	// take their ids
	const existingLayerIds = artboardLayerIds.map(({ layerId }) => layerId)
	console.log('existingLayerIds: ', existingLayerIds)

	// find new layers by their ids
	const newLayerIds = verifiedLayerIds.filter(
		layerId => !existingLayerIds.includes(layerId),
	)
	console.log('newLayerIds: ', newLayerIds)

	// create new artboard layers
	await createNewLayersOnArtboard(artboard.id, newLayerIds)
	console.log('created new layers on artboard')

	// and remove unchecked layers
	const layersToRemove = existingLayerIds.filter(
		existingLayerId => !verifiedLayerIds.includes(existingLayerId),
	)
	console.log('layersToRemove: ', layersToRemove)
	await removeLayersFromArtboard(artboard.id, layersToRemove)
	console.log('removed layers from artboard')

	// then get the updated artboard layers
	const updatedArtboard = await getArtboard(userId, artboardId)
	return updatedArtboard
}

const getArtboard = async (userId: string, artboardId: string) => {
	console.log('getting artboard')
	return await prisma.artboard.findFirst({
		where: { id: artboardId, ownerId: userId },
		select: { id: true, slug: true, owner: { select: { username: true } } },
	})
}

const getLayers = async (userId: string, layerIds: string[]) => {
	return await prisma.layer.findMany({
		where: { ownerId: userId, id: { in: layerIds } },
		select: {
			id: true,
			name: true,
			slug: true,
			owner: { select: { username: true } },
		},
	})
}

const getCurrentLayersOnArtboard = async (artboardId: string) => {
	return await prisma.layersOnArtboards.findMany({
		where: { artboardId },
		select: { layerId: true },
	})
}

const createNewLayersOnArtboard = async (
	artboardId: string,
	layerIds: string[],
) => {
	const layerOnArtboardPromises = layerIds.map((layerId, i) => {
		return prisma.layersOnArtboards.create({
			data: { artboardId, layerId, order: i },
		})
	})

	return await Promise.all(layerOnArtboardPromises)
}

const removeLayersFromArtboard = async (
	artboardId: string,
	layerIds: string[],
) => {
	const removalPromises = layerIds.map(layerId => {
		return prisma.layersOnArtboards.deleteMany({
			where: { artboardId, layerId },
		})
	})

	return await Promise.all(removalPromises)
}
