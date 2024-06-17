import { type Design } from '@prisma/client'
import { type designTypeEnum } from '#app/schema/design'
import {
	type IArtworkVersion,
	type IArtworkVersionWithChildren,
} from '../artwork-version/artwork-version.server'
import { type IFillCreateOverrides } from '../design-type/fill/fill.create.server'
import { type IFill } from '../design-type/fill/fill.server'
import { type ILayoutCreateOverrides } from '../design-type/layout/layout.create.server'
import { type ILayout } from '../design-type/layout/layout.server'
import { type ILineCreateOverrides } from '../design-type/line/line.create.server'
import { type ILine } from '../design-type/line/line.server'
import { type IPaletteCreateOverrides } from '../design-type/palette/palette.create.server'
import { type IPalette } from '../design-type/palette/palette.server'
import { type IRotateCreateOverrides } from '../design-type/rotate/rotate.create.server'
import { type IRotate } from '../design-type/rotate/rotate.server'
import { type ISizeCreateOverrides } from '../design-type/size/size.create.server'
import { type ISize } from '../design-type/size/size.server'
import { type IStrokeCreateOverrides } from '../design-type/stroke/stroke.create.server'
import { type IStroke } from '../design-type/stroke/stroke.server'
import { type ITemplateCreateOverrides } from '../design-type/template/template.create.server'
import { type ITemplate } from '../design-type/template/template.server'

export interface IDesign extends Design {}

export type IDesignIdOrNull = IDesign['id'] | null | undefined

export type IDesignEntityId =
	| IDesign['id']
	| IArtworkVersion['id']
	| IArtworkVersionWithChildren['id']
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
	artworkVersionId: string | null
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
export interface IDesignsByTypeWithType {
	type: designTypeEnum
	designs: IDesignWithType[]
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
