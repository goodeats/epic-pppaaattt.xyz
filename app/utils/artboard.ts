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
