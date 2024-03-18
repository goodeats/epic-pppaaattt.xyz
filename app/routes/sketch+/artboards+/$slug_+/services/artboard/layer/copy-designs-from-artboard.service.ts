import { type Layer, type Artboard, type User } from '@prisma/client'
import { findFirstArtboard } from '#app/models/artboard.server'
import {
	type IDesignWithPalette,
	findManyDesignsWithType,
	type IDesignsByType,
} from '#app/models/design.server'
import { findFirstLayer } from '#app/models/layer.server'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'
import { filterAndOrderArtboardDesignsByType } from '#app/utils/design'

type artboardLayerCopyDesignsFromArtboardServiceProps = {
	userId: User['id']
	artboardId: Artboard['id']
	layerId: Layer['id']
}

export const artboardLayerCopyDesignsFromArtboardService = async ({
	userId,
	artboardId,
	layerId,
}: artboardLayerCopyDesignsFromArtboardServiceProps) => {
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

		// Step 4: create new layer designs
		await createLayerDesigns({
			userId,
			layer,
			artboardDesignsByType,
			prisma,
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

const createLayerDesigns = async ({
	userId,
	layer,
	artboardDesignsByType,
	prisma,
}: {
	userId: User['id']
	layer: Layer
	artboardDesignsByType: IDesignsByType
	prisma: PrismaTransactionType
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

	await copyPaletteDesignsFromArtboard({
		userId,
		layer,
		designs: designPalettes,
		prisma,
	})
}

const copyPaletteDesignsFromArtboard = async ({
	userId,
	layer,
	designs,
	prisma,
}: {
	userId: User['id']
	layer: Layer
	designs: IDesignWithPalette[]
	prisma: PrismaTransactionType
}) => {
	console.log('copyPaletteDesignsFromArtboard', designs)
	// for (const design of designs) {
	//   const data = {
	//     ...design,
	//     artboardId,
	//     layerId,
	//   }
	//   const createDesignPromise = prisma.design.create({ data })
	// }
}
