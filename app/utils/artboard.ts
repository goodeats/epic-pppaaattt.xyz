import { type Artboard } from '@prisma/client'
import {
	ArtboardSelectedDesignsSchema,
	type ArtboardSelectedDesignsType,
} from '#app/schema/artboard'

export const parseArtboardSelectedDesigns = ({
	artboard,
}: {
	artboard: Pick<Artboard, 'selectedDesigns'>
}): ArtboardSelectedDesignsType => {
	const parsedJson = JSON.parse(artboard.selectedDesigns)
	return ArtboardSelectedDesignsSchema.parse(parsedJson)
}

export const stringifyArtboardSelectedDesigns = ({
	newSelectedDesigns,
}: {
	newSelectedDesigns: ArtboardSelectedDesignsType
}): string => {
	const validatedJson = ArtboardSelectedDesignsSchema.parse(newSelectedDesigns)
	return JSON.stringify(validatedJson)
}

// helper for when a design is deleted, made invisible, or moved
export const getNextVisibleDesignId = (
	visibleDesignIds: string[],
	currentDesignId: string,
): string | null => {
	const currentIndex = visibleDesignIds.indexOf(currentDesignId)
	if (currentIndex === -1) return null

	return visibleDesignIds[currentIndex + 1] || null
}

// helper for when a design is made visible or moved
export const getPrevVisibleDesignId = (
	visibleDesignIds: string[],
	currentDesignId: string,
): string | null => {
	const currentIndex = visibleDesignIds.indexOf(currentDesignId)
	if (currentIndex === -1) return null

	return visibleDesignIds[currentIndex - 1] || null
}
