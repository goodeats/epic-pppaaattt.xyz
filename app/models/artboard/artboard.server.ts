import { type Artboard } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'
import { type IArtboardBranchWithVersions } from '../artboard-branch/artboard-branch.server'
import { type IProjectWithArtboards } from '../project/project.server'

// Omitting 'createdAt' and 'updatedAt' from the Artboard interface
// prisma query returns a string for these fields
type BaseArtboard = Omit<Artboard, 'createdAt' | 'updatedAt'>

export interface IArtboard extends BaseArtboard {
	createdAt: DateOrString
	updatedAt: DateOrString
}
export interface IArtboardWithProject extends IArtboard {
	project: IProjectWithArtboards
}

export interface IArtboardWithBranchesAndVersions extends IArtboard {
	branches: IArtboardBranchWithVersions[]
}
