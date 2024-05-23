import { type ArtworkVersion } from '@prisma/client'
import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'
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
	branch?: IArtworkBranch
}

// created this for profile artwork view to review starred versions
// now wanting to display canvas from dialog
// canvas requires designs and layers to compute
// temp fix is to include branch for its name in table display
export interface IArtworkVersionWithBranch extends IArtworkVersion {
	branch: IArtworkBranch
}

export interface IArtworkVersionWithGenerator
	extends IArtworkVersionWithDesignsAndLayers {
	generator: IArtworkVersionGenerator
}
