import { type ArtboardBranch } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'
import { type IArtboardVersion } from '../artboard-version/artboard-version.server'

// Omitting 'createdAt' and 'updatedAt' from the ArtboardBranch interface
// prisma query returns a string for these fields
type BaseArtboardBranch = Omit<ArtboardBranch, 'createdAt' | 'updatedAt'>

export interface IArtboardBranch extends BaseArtboardBranch {
	createdAt: DateOrString
	updatedAt: DateOrString
}

export interface IArtboardBranchWithVersions extends IArtboardBranch {
	versions: IArtboardVersion[]
}
