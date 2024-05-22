import { type ArtworkBranch } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'
import { type IArtworkVersion } from '../artwork-version/artwork-version.server'

// Omitting 'createdAt' and 'updatedAt' from the ArtworkBranch interface
// prisma query returns a string for these fields
type BaseArtworkBranch = Omit<ArtworkBranch, 'createdAt' | 'updatedAt'>

export interface IArtworkBranch extends BaseArtworkBranch {
	createdAt: DateOrString
	updatedAt: DateOrString
}

export interface IArtworkBranchWithVersions extends IArtworkBranch {
	versions: IArtworkVersion[]
}
