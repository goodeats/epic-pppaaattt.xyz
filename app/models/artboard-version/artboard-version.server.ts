import { type ArtboardVersion } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'

// Omitting 'createdAt' and 'updatedAt' from the ArtboardVersion interface
// prisma query returns a string for these fields
type BaseArtboardVersion = Omit<ArtboardVersion, 'createdAt' | 'updatedAt'>

export interface IArtboardVersion extends BaseArtboardVersion {
	createdAt: DateOrString
	updatedAt: DateOrString
}
