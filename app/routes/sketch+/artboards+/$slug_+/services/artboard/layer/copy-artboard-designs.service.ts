import { type Layer, type Artboard, type User } from '@prisma/client'
import { findFirstArtboard } from '#app/models/artboard.server'
import {
	findManyDesignsWithType,
	type IDesignsByType,
} from '#app/models/design.server'
import { findFirstLayer } from '#app/models/layer.server'
import { filterAndOrderArtboardDesignsByType } from '#app/utils/design'
import { artboardLayerCopyArtboardDesignPalettesService } from './design/copy-artboard-design-palettes.service'

export const artboardLayerCopyArtboardDesignsService = async ({
	userId,
	artboardId,
	layerId,
}: {
	userId: User['id']
	artboardId: Artboard['id']
	layerId: Layer['id']
}) => {
	try {
		// Step 1: get layer
		const layer = await getLayer({ layerId, userId })

		// Step 2: get artboard
		const artboard = await getArtboard({ artboardId, userId })

		// Step 3: find existing artboard designs
		const artboardDesigns = await findManyDesignsWithType({
			where: { artboardId: artboard.id },
		})

		// Step 3: separate artboard designs by type
		const artboardDesignsByType = filterAndOrderArtboardDesignsByType({
			artboardDesigns,
		})

		// Step 4: create new layer designs for each type
		await createLayerDesignTypes({
			userId,
			layer,
			artboardDesignsByType,
		})

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: true }
	}
}

const getLayer = async ({
	layerId,
	userId,
}: {
	layerId: Layer['id']
	userId: User['id']
}) => {
	const layer = await findFirstLayer({
		where: { id: layerId, ownerId: userId },
	})

	if (!layer) throw new Error('Layer not found')

	return layer
}

const getArtboard = async ({
	artboardId,
	userId,
}: {
	artboardId: Artboard['id']
	userId: User['id']
}) => {
	const artboard = await findFirstArtboard({
		where: { id: artboardId, ownerId: userId },
	})

	if (!artboard) throw new Error('Artboard not found')

	return artboard
}

const createLayerDesignTypes = async ({
	userId,
	layer,
	artboardDesignsByType,
}: {
	userId: User['id']
	layer: Layer
	artboardDesignsByType: IDesignsByType
}) => {
	const {
		designPalettes,
		// designSizes,
		// designFills,
		// designStrokes,
		// designLines,
		// designRotates,
		// designLayouts,
		// designTemplates,
	} = artboardDesignsByType

	await artboardLayerCopyArtboardDesignPalettesService({
		userId,
		layer,
		designs: designPalettes,
	})
}
