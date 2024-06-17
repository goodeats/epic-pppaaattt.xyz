import { prisma } from '#app/utils/db.server'
import { type IDesign } from '../design/design.server'

export interface IDesignUpdatedResponse {
	success: boolean
	message?: string
	updatedDesign?: IDesign
}

export const updateDesignVisible = ({
	id,
	visible,
}: {
	id: IDesign['id']
	visible: boolean
}) => {
	return prisma.design.update({
		where: { id },
		data: { visible },
	})
}

export const connectPrevAndNextDesigns = ({
	prevId,
	nextId,
}: {
	prevId: IDesign['id']
	nextId: IDesign['id']
}) => {
	const connectNextToPrev = prisma.design.update({
		where: { id: prevId },
		data: { nextId },
	})
	const connectPrevToNext = prisma.design.update({
		where: { id: nextId },
		data: { prevId },
	})
	return [connectNextToPrev, connectPrevToNext]
}

export const updateDesignToHead = ({ id }: { id: IDesign['id'] }) => {
	return prisma.design.update({
		where: { id },
		data: { prevId: null },
	})
}

export const updateDesignToTail = ({ id }: { id: IDesign['id'] }) => {
	return prisma.design.update({
		where: { id },
		data: { nextId: null },
	})
}

export const updateDesignRemoveNodes = ({ id }: { id: IDesign['id'] }) => {
	return prisma.design.update({
		where: { id },
		data: { prevId: null, nextId: null },
	})
}

export const updateDesignNodes = ({
	id,
	nextId,
	prevId,
}: {
	id: string
	nextId: string | null
	prevId: string | null
}) => {
	return prisma.design.update({
		where: { id },
		data: { prevId, nextId },
	})
}
