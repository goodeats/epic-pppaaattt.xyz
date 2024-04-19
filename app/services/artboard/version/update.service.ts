import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import {
	updateArtboardVersionBackground,
	updateArtboardVersionHeight,
	updateArtboardVersionWidth,
} from '#app/models/artboard-version/artboard-version.update.server'

export async function updateArtboardVersionWidthService({
	id,
	width,
}: {
	id: IArtboardVersion['id']
	width: number
}) {
	try {
		const updatedArtboardVersion = await updateArtboardVersionWidth({
			id,
			width,
		})
		// later will be adding Activity class
		// i.e, edit history so you can undo changes and/or see who made them
		return { success: true, artboardVersion: updatedArtboardVersion }
	} catch (error) {
		console.error(error)
		return { success: false }
	}
}

export async function updateArtboardVersionHeightService({
	id,
	height,
}: {
	id: IArtboardVersion['id']
	height: number
}) {
	try {
		const updatedArtboardVersion = await updateArtboardVersionHeight({
			id,
			height,
		})
		return { success: true, artboardVersion: updatedArtboardVersion }
	} catch (error) {
		console.error(error)
		return { success: false }
	}
}

export async function updateArtboardVersionBackgroundService({
	id,
	background,
}: {
	id: IArtboardVersion['id']
	background: string
}) {
	try {
		const updatedArtboardVersion = await updateArtboardVersionBackground({
			id,
			background,
		})
		return { success: true, artboardVersion: updatedArtboardVersion }
	} catch (error) {
		console.error(error)
		return { success: false }
	}
}
