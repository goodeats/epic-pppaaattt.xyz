import { type Design } from '@prisma/client'
import {
	type selectArgsType,
	type findDesignArgsType,
	type whereArgsType,
} from '#app/schema/design'
import { prisma } from '#app/utils/db.server'
import { type IFill } from './fill.server'
import { type ILayout } from './layout.server'
import { type ILine } from './line.server'
import { type IPalette } from './palette.server'
import { type IRotate } from './rotate.server'
import { type ISize } from './size.server'
import { type IStroke } from './stroke.server'

export interface IDesignWithType {
	id: string
	type: string
	visible: boolean
	createdAt: Date | string
	nextId: string | null
	prevId: string | null
	ownerId: string
	artboardId: string | null
	palette: IPalette | null
	size: ISize | null
	fill: IFill | null
	stroke: IStroke | null
	line: ILine | null
	rotate: IRotate | null
	layout: ILayout | null
}

export interface IDesignWithPalette extends IDesignWithType {
	palette: IPalette
}

export interface IDesignWithSize extends IDesignWithType {
	size: ISize
}

export interface IDesignWithFill extends IDesignWithType {
	fill: IFill
}

export interface IDesignWithStroke extends IDesignWithType {
	stroke: IStroke
}

export interface IDesignWithLine extends IDesignWithType {
	line: ILine
}

export interface IDesignWithRotate extends IDesignWithType {
	rotate: IRotate
}

export interface IDesignWithLayout extends IDesignWithType {
	layout: ILayout
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
			size: true,
			fill: true,
			stroke: true,
			line: true,
			rotate: true,
			layout: true,
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
