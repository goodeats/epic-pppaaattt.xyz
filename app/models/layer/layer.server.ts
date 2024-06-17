import { type Layer } from '@prisma/client'
import { type DateOrString } from '#app/definitions/prisma-helper'
import { type findLayerArgsType } from '#app/schema/layer'
import { prisma } from '#app/utils/db.server'
import { type IArtwork } from '../artwork/artwork.server'
import { type IArtworkVersion } from '../artwork-version/artwork-version.server'
import { type IAssetParsed } from '../asset/asset.server'
import { type IDesignWithType } from '../design/design.server'

// Omitting 'createdAt' and 'updatedAt' from the Layer interface
// prisma query returns a string for these fields
type BaseLayer = Omit<Layer, 'createdAt' | 'updatedAt'>

export interface ILayer extends BaseLayer {
	createdAt: DateOrString
	updatedAt: DateOrString
}

export type ILayerEntityId = IArtwork['id'] | IArtworkVersion['id']
export interface ILayerWithDesigns extends ILayer {
	designs: IDesignWithType[]
}

export interface ILayerWithChildren extends ILayer {
	assets: IAssetParsed[]
	designs: IDesignWithType[]
}

export interface ILayerCreateOverrides {
	name?: string
	description?: string
	slug?: string
	visible?: boolean
}

export const findFirstLayer = async ({
	where,
	select,
}: findLayerArgsType): Promise<Layer | null> => {
	return await prisma.layer.findFirst({
		where,
		select,
	})
}

export const connectPrevAndNextLayers = ({
	prevId,
	nextId,
}: {
	prevId: ILayer['id']
	nextId: ILayer['id']
}) => {
	const connectNextToPrev = prisma.layer.update({
		where: { id: prevId },
		data: { nextId },
	})
	const connectPrevToNext = prisma.layer.update({
		where: { id: nextId },
		data: { prevId },
	})
	return [connectNextToPrev, connectPrevToNext]
}

export const updateLayerToHead = ({ id }: { id: ILayer['id'] }) => {
	return prisma.layer.update({
		where: { id },
		data: { prevId: null },
	})
}

export const updateLayerToTail = ({ id }: { id: ILayer['id'] }) => {
	return prisma.layer.update({
		where: { id },
		data: { nextId: null },
	})
}

export const updateLayerRemoveNodes = ({ id }: { id: ILayer['id'] }) => {
	return prisma.layer.update({
		where: { id },
		data: { prevId: null, nextId: null },
	})
}

export const updateLayerNodes = ({
	id,
	nextId,
	prevId,
}: {
	id: string
	nextId: string | null
	prevId: string | null
}) => {
	return prisma.layer.update({
		where: { id },
		data: { prevId, nextId },
	})
}

export const updateLayerVisible = ({
	id,
	visible,
}: {
	id: ILayer['id']
	visible: boolean
}) => {
	return prisma.layer.update({
		where: { id },
		data: { visible },
	})
}
