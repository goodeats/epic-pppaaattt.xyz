import { type Design } from '@prisma/client'
import {
	type selectArgsType,
	type findDesignArgsType,
	type whereArgsType,
} from '#app/schema/design'
import { type PrismaTransactionType, prisma } from '#app/utils/db.server'
import { type IArtboard } from './artboard.server'
import { type IFillCreateOverrides, type IFill } from './fill.server'
import { type ILayoutCreateOverrides, type ILayout } from './layout.server'
import { type ILineCreateOverrides, type ILine } from './line.server'
import { type IPaletteCreateOverrides, type IPalette } from './palette.server'
import { type IRotateCreateOverrides, type IRotate } from './rotate.server'
import { type ISizeCreateOverrides, type ISize } from './size.server'
import { type IStrokeCreateOverrides, type IStroke } from './stroke.server'
import {
	type ITemplateCreateOverrides,
	type ITemplate,
} from './template.server'

export interface IDesign extends Design {}

export type IDesignIdOrNull = IDesign['id'] | null | undefined

export type IDesignEntityId = IArtboard['id'] | IDesign['id']
export type IDesignEntityIdOrNull = IDesignEntityId | null | undefined

export interface IDesignCreateOverrides {
	visible?: boolean
	selected?: boolean
}

export type IDesignTypeCreateOverrides =
	| IPaletteCreateOverrides
	| ISizeCreateOverrides
	| IFillCreateOverrides
	| IStrokeCreateOverrides
	| ILineCreateOverrides
	| IRotateCreateOverrides
	| ILayoutCreateOverrides
	| ITemplateCreateOverrides
export interface IDesignWithType {
	id: string
	type: string
	visible: boolean
	selected: boolean
	createdAt: Date | string
	nextId: string | null
	prevId: string | null
	ownerId: string
	artboardId: string | null
	layerId: string | null
	palette: IPalette | null
	size: ISize | null
	fill: IFill | null
	stroke: IStroke | null
	line: ILine | null
	rotate: IRotate | null
	layout: ILayout | null
	template: ITemplate | null
}

export interface IDesignsByType {
	designPalettes: IDesignWithPalette[]
	designSizes: IDesignWithSize[]
	designFills: IDesignWithFill[]
	designStrokes: IDesignWithStroke[]
	designLines: IDesignWithLine[]
	designRotates: IDesignWithRotate[]
	designLayouts: IDesignWithLayout[]
	designTemplates: IDesignWithTemplate[]
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

export interface IDesignWithTemplate extends IDesignWithType {
	template: ITemplate
}

export type IDesignType =
	| IDesign
	| IDesignWithType
	| IDesignWithPalette
	| IDesignWithSize
	| IDesignWithFill
	| IDesignWithStroke
	| IDesignWithLine
	| IDesignWithRotate
	| IDesignWithLayout
	| IDesignWithTemplate

export interface ISelectedDesigns {
	palette: IPalette | null
	size: ISize | null
	fill: IFill | null
	stroke: IStroke | null
	line: ILine | null
	rotate: IRotate | null
	layout: ILayout | null
	template: ITemplate | null
}

export interface ISelectedDesignsFiltered {
	palette?: IPalette
	size?: ISize
	fill?: IFill
	stroke?: IStroke
	line?: ILine
	rotate?: IRotate
	layout?: ILayout
	template?: ITemplate
}

export const findManyDesignsWithType = async ({
	where,
}: {
	where: whereArgsType
}): Promise<IDesignWithType[]> => {
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
			template: true,
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

// only use in transactions
export const getTransactionDesign = async ({
	id,
	prisma,
}: {
	id: string
	prisma: PrismaTransactionType
}) => {
	const designPromise = findDesignTransactionPromise({ id, prisma })
	const design = await designPromise

	// prevent any pending promises in the transaction
	if (!design) throw new Error(`Design not found: ${id}`)

	return design
}

export const findDesignTransactionPromise = ({
	id,
	prisma,
}: {
	id: string
	prisma: PrismaTransactionType
}) => {
	return prisma.design.findFirst({
		where: { id },
	})
}

export const connectPrevAndNextDesignsPromise = ({
	prevId,
	nextId,
	prisma,
}: {
	prevId: Design['id']
	nextId: Design['id']
	prisma: PrismaTransactionType
}) => {
	return [
		prisma.design.update({
			where: { id: prevId },
			data: { nextId },
		}),
		prisma.design.update({
			where: { id: nextId },
			data: { prevId },
		}),
	]
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

export const deleteDesign = ({ id }: { id: IDesign['id'] }) => {
	return prisma.design.delete({
		where: { id },
	})
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
