import { type ArtworkImage } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'

// Omitting 'createdAt' and 'updatedAt' from the ArtworkImage interface
// prisma query returns a string for these fields
// also excluding 'blob' field since this will be served from a resource route
type BaseArtworkImage = Omit<ArtworkImage, 'createdAt' | 'updatedAt' | 'blob'>

export interface IArtworkImage extends BaseArtworkImage {
	createdAt: DateOrString
	updatedAt: DateOrString
}
