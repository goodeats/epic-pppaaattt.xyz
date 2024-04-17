import { type Artboard } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'
import {
	type findArtboardArgsType,
	type selectArgsType,
	type whereArgsType,
} from '#app/schema/artboard'
import { prisma } from '#app/utils/db.server'
import { type IArtboardBranchWithVersions } from './artboard-branch.server'
import { type IDesignWithType } from './design.server'
import { type ILayerWithDesigns } from './layer.server'
import { type IProjectWithArtboards } from './project/project.server'

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
export interface IArtboardWithDesignsAndLayers extends IArtboard {
	designs: IDesignWithType[]
	layers: ILayerWithDesigns[]
}
export interface IArtboardWithBranchesAndVersions extends IArtboard {
	branches: IArtboardBranchWithVersions[]
}

export type PickedArtboardType = {
	id: string
	name: string
	description: string | null
	slug: string
	width: number
	height: number
	backgroundColor: string
	updatedAt: Date | string
	project: {
		id: string
		name: string
		slug: string
	}
}

// use prisma extension to .save() or .delete()

export const findFirstArtboard = async ({
	where,
	select,
}: findArtboardArgsType): Promise<Artboard | null> => {
	return await prisma.artboard.findFirst({
		where,
		select,
	})
}

export const findArtboardByIdAndOwner = async ({
	id,
	ownerId,
	select,
}: {
	id: whereArgsType['id']
	ownerId: whereArgsType['ownerId']
	select?: selectArgsType
}): Promise<Artboard | null> => {
	const where = { id, ownerId }
	return await findFirstArtboard({ where, select })
}
