import { type ArtboardBranch } from '@prisma/client'
import { type IArtboardVersion } from './artboard-version.server'

export interface IArtboardBranch extends ArtboardBranch {}

export interface IArtboardBranchWithVersions extends IArtboardBranch {
	versions: IArtboardVersion[]
}
