import { type Design } from '@prisma/client'
import {
	type selectArgsType,
	type findDesignArgsType,
	type whereArgsType,
} from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { type IPalette } from './palette.server'

export interface IDesignWithType {
	id: string
	type: string
	visible: boolean
	createdAt: Date | string
	ownerId: string
	artboardId: string | null
	palette: IPalette | null
}

export interface IDesignWithPalette extends IDesignWithType {
	palette: IPalette
}

export const findManyDesignsWithType = async ({
	where,
}: {
	where: whereArgsType
}) => {
	const designs = await prisma.design.findMany({
		where,
		include: {
			palette: true,
		},
		orderBy: {
			type: 'asc',
		},
	})
	return designs
}

export const findFirstDesign = async ({
	where,
	select,
}: findDesignArgsType): Promise<Design | null> => {
	return await prisma.design.findFirst({
		where,
		select,
	})
}

export const findDesignByIdAndOwner = async ({
	id,
	ownerId,
	select,
}: {
	id: whereArgsType['id']
	ownerId: whereArgsType['ownerId']
	select?: selectArgsType
}): Promise<Design | null> => {
	const where = { id, ownerId }
	return await findFirstDesign({ where, select })
}