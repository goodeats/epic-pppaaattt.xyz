import { type Artboard } from '@prisma/client'
import {
	ArtboardSelectedDesignsCompleteSchema,
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

export const artboardSelectedDesignsCompleted = ({
	artboard: { selectedDesigns },
}: {
	artboard: Pick<Artboard, 'selectedDesigns'>
}): boolean => {
	const parsedSelectedDesigns = parseArtboardSelectedDesigns({
		artboard: { selectedDesigns },
	})
	// Assuming Zod or similar, replace `parse` with a method that checks validity and returns a boolean
	// For Zod, it could be something like `.safeParse()` and then checking the success property
	const result = ArtboardSelectedDesignsCompleteSchema.safeParse(
		parsedSelectedDesigns,
	)
	return result.success
}

export const artboardSelectedDesignIdsToArray = ({
	artboard: { selectedDesigns },
}: {
	artboard: Pick<Artboard, 'selectedDesigns'>
}): string[] => {
	const parsedSelectedDesigns = parseArtboardSelectedDesigns({
		artboard: { selectedDesigns },
	})
	return Object.values(parsedSelectedDesigns)
}

// helper for when a design is deleted, made invisible, or moved
export const getNextDesignId = (
	visibleDesignIds: string[],
	currentDesignId: string,
): string | null => {
	const currentIndex = visibleDesignIds.indexOf(currentDesignId)
	if (currentIndex === -1) return null

	return visibleDesignIds[currentIndex + 1] || null
}

// helper for when a design is made visible or moved
export const getPrevDesignId = (
	visibleDesignIds: string[],
	currentDesignId: string,
): string | null => {
	const currentIndex = visibleDesignIds.indexOf(currentDesignId)
	if (currentIndex === -1) return null

	return visibleDesignIds[currentIndex - 1] || null
}

export const findFirstDesignIdInArray = (
	designIds: string[],
	designId1: string,
	designId2: string,
): string | null => {
	const index1 = designIds.indexOf(designId1)
	const index2 = designIds.indexOf(designId2)
	if (index1 === -1 && index2 === -1) return null // Neither value is found
	if (index1 !== -1 && index2 === -1) return designId1 // Only designId1 is found
	if (index1 === -1 && index2 !== -1) return designId2 // Only designId2 is found
	// Both values are found, return the one with the lower index
	return index1 < index2 ? designId1 : designId2
}
