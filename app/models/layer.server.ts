import { type Layer } from '@prisma/client'
import {
	type findLayerArgsType,
	type selectArgsType,
	type whereArgsType,
} from '#app/schema/layer'
import { prisma } from '#app/utils/db.server'
import { type IArtboardVersion } from './artboard-version/artboard-version.server'
import { type IArtboard } from './artboard/artboard.server'
import { type IDesignWithType } from './design.server'

export interface ILayer {
	id: string
	name: string
	description: string | null
	slug: string | null
	visible: boolean
	selected: boolean
	createdAt: Date | string
	updatedAt: Date | string
	ownerId: string
	artboardId: string | null
	artboardVersionId: string | null
	nextId: string | null
	prevId: string | null
	parentId: string | null
	// children: ILayer[]
	// designs: IDesignWithType[]
}

export type ILayerEntityId = IArtboard['id'] | IArtboardVersion['id']
export interface ILayerWithDesigns extends ILayer {
	designs: IDesignWithType[]
}

export interface ILayerCreateOverrides {
	name?: string
	description?: string
	slug?: string
	visible?: boolean
}

export const findManyLayers = async ({ where }: { where: whereArgsType }) => {
	const layers = await prisma.layer.findMany({
		where,
		// include: {
		// 	designs: true,
		// 	children: true,
		// },
	})
	return layers
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

export const findLayerByIdAndOwner = async ({
	id,
	ownerId,
	select,
}: {
	id: whereArgsType['id']
	ownerId: whereArgsType['ownerId']
	select?: selectArgsType
}): Promise<Layer | null> => {
	const where = { id, ownerId }
	return await findFirstLayer({ where, select })
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
