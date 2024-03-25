import {
	findManyDesignsWithType,
	type IDesignsByType,
	type IDesignWithType,
} from '#app/models/design.server'
import { type IFill } from '#app/models/fill.server'
import { type ILayer } from '#app/models/layer.server'
import { type ILayout } from '#app/models/layout.server'
import { type ILine } from '#app/models/line.server'
import { type IPalette } from '#app/models/palette.server'
import { type IRotate } from '#app/models/rotate.server'
import { type ISize } from '#app/models/size.server'
import { type IStroke } from '#app/models/stroke.server'
import { type ITemplate } from '#app/models/template.server'
import { prisma } from '#app/utils/db.server'
import { filterAndOrderArtboardDesignsByType } from '#app/utils/design'
import { artboardBuildCreateService } from './services/artboard/build/create.service'

export const getOwner = async (userId: string) => {
	return await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			image: { select: { id: true } },
			artboards: { select: { id: true, slug: true, name: true } },
		},
		where: { id: userId },
	})
}

export type PickedArtboardType = {
	id: string
	name: string
	description: string | null
	slug: string
	width: number
	height: number
	backgroundColor: string
	selectedDesigns: string
	updatedAt: Date | string
	project: {
		id: string
		name: string
		slug: string
	}
}

export const getArtboard = async (
	userId: string,
	slug: string,
): Promise<PickedArtboardType | null> => {
	return await prisma.artboard.findFirst({
		where: { slug: slug, ownerId: userId },
		select: {
			id: true,
			name: true,
			description: true,
			slug: true,
			width: true,
			height: true,
			backgroundColor: true,
			selectedDesigns: true,
			updatedAt: true,
			project: {
				select: {
					id: true,
					name: true,
					slug: true,
				},
			},
		},
	})
}

export const getLayer = async ({
	layerId,
	userId,
	artboardId,
}: {
	layerId: string
	userId: string
	artboardId: string
}): Promise<ILayer | null> => {
	return await prisma.layer.findFirst({
		where: { id: layerId, ownerId: userId, artboardId },
	})
}

export const getLayerDesigns = async ({
	layer,
}: {
	layer: ILayer
}): Promise<IDesignsByType> => {
	const designs = await findManyDesignsWithType({
		where: { layerId: layer.id },
	})

	return filterAndOrderArtboardDesignsByType({ designs })
}

export const getArtboardDesigns = async ({
	artboard,
}: {
	artboard: PickedArtboardType
}): Promise<IDesignWithType[]> => {
	const artboardDesigns = await findManyDesignsWithType({
		where: { artboardId: artboard.id },
	})
	return artboardDesigns
}

// this could be its own model potentially
// i.e., artboard has many builds
export interface IArtboardBuild {
	id: string
	layers: IArtboardLayerBuild[]
}

export interface IArtboardLayerBuild {
	palette: IPalette
	size: ISize
	fill: IFill
	stroke: IStroke
	line: ILine
	rotate: IRotate
	layout: ILayout
	template: ITemplate
	// create this type
	container: IArtboardLayerContainerBuild
}

export interface IArtboardLayerContainerBuild {
	width: number
	height: number
	top: number
	left: number
	margin: number
}

export const getArtboardBuild = async (
	artboard: PickedArtboardType,
	layers: ILayer[],
): Promise<IArtboardBuild | null> => {
	const artboardBuild = await artboardBuildCreateService({ artboard, layers })
	return artboardBuild
}
