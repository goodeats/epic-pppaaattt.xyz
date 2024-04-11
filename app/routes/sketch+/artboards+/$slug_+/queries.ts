import { type IArtboardGenerator } from '#app/definitions/artboard-generator'
import {
	findManyDesignsWithType,
	type IDesignsByType,
} from '#app/models/design.server'
import { findManyLayers, type ILayer } from '#app/models/layer.server'
import { prisma } from '#app/utils/db.server'
import { filterAndOrderDesignsByType } from '#app/utils/design'
import { orderLinkedLayers } from '#app/utils/layer.utils'
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

export const getLayers = async ({
	userId,
	artboardId,
}: {
	userId: string
	artboardId: string
}): Promise<ILayer[]> => {
	const layers = await findManyLayers({
		where: { ownerId: userId, artboardId },
	})
	return orderLinkedLayers(layers)
}

export const getArtboardDesigns = async ({
	artboard,
}: {
	artboard: PickedArtboardType
}): Promise<IDesignsByType> => {
	const designs = await findManyDesignsWithType({
		where: { artboardId: artboard.id },
	})

	return filterAndOrderDesignsByType({ designs })
}

export const getLayerDesigns = async ({
	layer,
}: {
	layer: ILayer
}): Promise<IDesignsByType> => {
	const designs = await findManyDesignsWithType({
		where: { layerId: layer.id },
	})
	return filterAndOrderDesignsByType({ designs })
}

export const getArtboardGenerator = async (
	artboard: PickedArtboardType,
	layers: ILayer[],
): Promise<IArtboardGenerator> => {
	const artboardBuild = await artboardBuildCreateService({ artboard, layers })
	return artboardBuild
}
