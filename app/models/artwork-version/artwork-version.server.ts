import { type ArtworkVersion } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'
import { type IArtworkBranch } from '../artwork-branch/artwork-branch.server'
import { type IDesignWithType } from '../design/design.server'
import { type ILayerWithDesigns } from '../layer/layer.server'

// Omitting 'createdAt' and 'updatedAt' from the ArtworkVersion interface
// prisma query returns a string for these fields
type BaseArtworkVersion = Omit<
	ArtworkVersion,
	'createdAt' | 'updatedAt' | 'publishedAt'
>

export interface IArtworkVersion extends BaseArtworkVersion {
	createdAt: DateOrString
	updatedAt: DateOrString
	publishedAt: DateOrString | null
}

export interface IArtworkVersionWithDesignsAndLayers extends IArtworkVersion {
	designs: IDesignWithType[]
	layers: ILayerWithDesigns[]
}

export interface IArtworkVersionWithBranch extends IArtworkVersion {
	branch: IArtworkBranch
}
