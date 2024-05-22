import { type Project } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'
import { type IArtwork } from '../artwork/artwork.server'

// Omitting 'createdAt' and 'updatedAt' from the Project interface
// prisma query returns a string for these fields
type BaseProject = Omit<Project, 'createdAt' | 'updatedAt'>

export interface IProject extends BaseProject {
	createdAt: DateOrString
	updatedAt: DateOrString
}
export interface IProjectWithArtworks extends IProject {
	artworks: IArtwork[]
}
