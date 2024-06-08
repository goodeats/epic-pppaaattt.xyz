import { type LayerImage } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'

// Omitting 'createdAt' and 'updatedAt' from the LayerImage interface
// prisma query returns a string for these fields
type BaseLayerImage = Omit<LayerImage, 'createdAt' | 'updatedAt'>

export interface ILayerImage extends BaseLayerImage {
	createdAt: DateOrString
	updatedAt: DateOrString
}
