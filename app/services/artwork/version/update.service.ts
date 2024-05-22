import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import {
	updateArtworkVersionBackground,
	updateArtworkVersionHeight,
	updateArtworkVersionWidth,
} from '#app/models/artwork-version/artwork-version.update.server'

export async function updateArtworkVersionWidthService({
	id,
	width,
}: {
	id: IArtworkVersion['id']
	width: number
}) {
	try {
		const updatedArtworkVersion = await updateArtworkVersionWidth({
			id,
			width,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
		return { success: true, artworkVersion: updatedArtworkVersion }
	} catch (error) {
		console.error(error)
		return { success: false }
	}
}

export async function updateArtworkVersionHeightService({
	id,
	height,
}: {
	id: IArtworkVersion['id']
	height: number
}) {
	try {
		const updatedArtworkVersion = await updateArtworkVersionHeight({
			id,
			height,
		})
		return { success: true, artworkVersion: updatedArtworkVersion }
	} catch (error) {
		console.error(error)
		return { success: false }
	}
}

export async function updateArtworkVersionBackgroundService({
	id,
	background,
}: {
	id: IArtworkVersion['id']
	background: string
}) {
	try {
		const updatedArtworkVersion = await updateArtworkVersionBackground({
			id,
			background,
		})
		return { success: true, artworkVersion: updatedArtworkVersion }
	} catch (error) {
		console.error(error)
		return { success: false }
	}
}
