import { type Layer } from '@prisma/client'
import {
	type findLayerArgsType,
	type selectArgsType,
	type whereArgsType,
} from '#app/schema/layer'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'

export interface ILayer {
	id: string
	name: string
	description: string | null
	slug: string | null
	visible: boolean
	selectedDesigns: string
	createdAt: Date | string
	updatedAt: Date | string
	ownerId: string
	artboardId: string | null
	nextId: string | null
	prevId: string | null
	parentId: string | null
	// children: ILayer[]
	// designs: IDesignWithType[]
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

// only use in transactions
export const getTransactionLayer = async ({
	id,
	prisma,
}: {
	id: string
	prisma: PrismaTransactionType
}) => {
	const layerPromise = findLayerTransactionPromise({ id, prisma })
	const layer = await layerPromise

	// prevent any pending promises in the transaction
	if (!layer) throw new Error(`Layer not found: ${id}`)

	return layer
}

export const findLayerTransactionPromise = ({
	id,
	prisma,
}: {
	id: string
	prisma: PrismaTransactionType
}) => {
	return prisma.layer.findFirst({
		where: { id },
	})
}

export const connectPrevAndNextLayersPromise = ({
	prevId,
	nextId,
	prisma,
}: {
	prevId: ILayer['id']
	nextId: ILayer['id']
	prisma: PrismaTransactionType
}) => {
	return [
		prisma.layer.update({
			where: { id: prevId },
			data: { nextId },
		}),
		prisma.layer.update({
			where: { id: nextId },
			data: { prevId },
		}),
	]
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
