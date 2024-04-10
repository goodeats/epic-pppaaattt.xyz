import { type Project } from '@prisma/client'
import { type IArtboardWithProject } from './artboard.server'

export interface IProject extends Project {}
export interface IProjectWithArtboards extends IProject {
	artboards: IArtboardWithProject[]
}
