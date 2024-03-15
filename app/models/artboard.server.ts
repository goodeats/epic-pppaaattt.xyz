import { type Design, type Artboard } from '@prisma/client'
import {
	type ArtboardSelectedDesignsType,
	type findArtboardArgsType,
	type selectArgsType,
	type whereArgsType,
} from '#app/schema/artboard'
import { type designTypeEnum } from '#app/schema/design'
import {
	parseArtboardSelectedDesigns,
	stringifyArtboardSelectedDesigns,
} from '#app/utils/artboard'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'
import { findDesignTransactionPromise } from './design.server'

export interface IArtboard extends Artboard {}

// use prisma extension to .save() or .delete()

export const findFirstArtboard = async ({
	where,
	select,
}: findArtboardArgsType): Promise<Artboard | null> => {
	return await prisma.artboard.findFirst({
		where,
		select,
	})
}

export const findArtboardByIdAndOwner = async ({
	id,
	ownerId,
	select,
}: {
	id: whereArgsType['id']
	ownerId: whereArgsType['ownerId']
	select?: selectArgsType
}): Promise<Artboard | null> => {
	const where = { id, ownerId }
	return await findFirstArtboard({ where, select })
}

export const findArtboardTransactionPromise = ({
	id,
	prisma,
}: {
	id: string
	prisma: PrismaTransactionType
}): Promise<Artboard | null> => {
	return prisma.artboard.findFirst({
		where: { id },
	})
}

// only use in transactions
export const getTransactionArtboard = async ({
	id,
	prisma,
}: {
	id: string
	prisma: PrismaTransactionType
}) => {
	const artboard = await prisma.artboard.findFirst({
		where: { id },
	})
	// prevent any pending promises in the transaction
	if (!artboard) throw new Error(`Artboard not found: ${id}`)

	return artboard
}

export const updateArtboardSelectedDesignPromise = ({
	artboard,
	designId,
	type,
	prisma,
}: {
	artboard: Pick<IArtboard, 'id' | 'selectedDesigns'>
	designId: Design['id']
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	// parse the selectedDesigns of the artboard
	const parsedSelectedDesigns = parseArtboardSelectedDesigns({ artboard })

	// set the key for the parsedSelectedDesigns object to update
	const designKey = (type + 'Id') as keyof ArtboardSelectedDesignsType

	// build the updated parsedSelectedDesigns object
	const newSelectedDesigns = {
		...parsedSelectedDesigns,
		[designKey]: designId,
	}
	const updatedSelectedDesigns = stringifyArtboardSelectedDesigns({
		newSelectedDesigns,
	})

	// update the selectedDesigns for the artboard
	return prisma.artboard.update({
		where: { id: artboard.id },
		data: { selectedDesigns: updatedSelectedDesigns },
	})
}

export const removeArtboardSelectedDesignPromise = ({
	artboard,
	type,
	prisma,
}: {
	artboard: Pick<IArtboard, 'id' | 'selectedDesigns'>
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	// parse the selectedDesigns of the artboard
	const parsedSelectedDesigns = parseArtboardSelectedDesigns({ artboard })

	// set the key for the parsedSelectedDesigns object to update
	const designKey = (type + 'Id') as keyof ArtboardSelectedDesignsType

	// build the updated parsedSelectedDesigns object
	// with the design key removed
	const { [designKey]: _, ...newSelectedDesigns } = parsedSelectedDesigns
	const updatedSelectedDesigns = stringifyArtboardSelectedDesigns({
		newSelectedDesigns,
	})

	// update the selectedDesigns for the artboard
	return prisma.artboard.update({
		where: { id: artboard.id },
		data: { selectedDesigns: updatedSelectedDesigns },
	})
}

export const artboardUpdateSelectedDesignPromise = async ({
	artboardId,
	updateSelectedDesignId,
	type,
	prisma,
}: {
	artboardId: string
	updateSelectedDesignId: string | null
	type: designTypeEnum
	prisma: PrismaTransactionType
}) => {
	// Fetch artboard for selected designs
	const fetchArtboardPromise = findArtboardTransactionPromise({
		id: artboardId,
		prisma,
	})
	const [artboard] = await Promise.all([fetchArtboardPromise])
	if (!artboard) return [Promise.resolve()]

	if (updateSelectedDesignId) {
		const fetchNewSelectedDesign = findDesignTransactionPromise({
			id: updateSelectedDesignId,
			prisma,
		})
		const [newSelectedDesign] = await Promise.all([fetchNewSelectedDesign])
		if (!newSelectedDesign) return [Promise.resolve()]

		return [
			updateArtboardSelectedDesignPromise({
				artboard,
				designId: updateSelectedDesignId,
				type,
				prisma,
			}),
		]
	} else {
		return [
			removeArtboardSelectedDesignPromise({
				artboard,
				type,
				prisma,
			}),
		]
	}
}
