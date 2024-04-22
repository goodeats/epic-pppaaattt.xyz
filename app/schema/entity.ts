import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type IDesignWithType, type IDesign } from '#app/models/design.server'
import { type IFill } from '#app/models/fill.server'
import { type ILayer } from '#app/models/layer.server'
import { type ILayout } from '#app/models/layout.server'
import { type ILine } from '#app/models/line.server'
import { type IPalette } from '#app/models/palette.server'
import { type IRotate } from '#app/models/rotate.server'
import { type ISize } from '#app/models/size.server'
import { type IStroke } from '#app/models/stroke.server'
import { type ITemplate } from '#app/models/template.server'
import { type ObjectValues } from '#app/utils/typescript-helpers'
import { type designTypeEnum } from './design'

export type IEntity =
	| IDesign
	| IDesignWithType
	| IArtboardVersion
	| IPalette
	| ISize
	| IFill
	| IStroke
	| ILine
	| IRotate
	| ILayout
	| ITemplate

export type IEntityVisible = IDesign | IDesignWithType | ILayer

export type IEntityId =
	| IDesign['id']
	| IDesignWithType['id']
	| IArtboardVersion['id']
	| IPalette['id']
	| ISize['id']
	| IFill['id']
	| IStroke['id']
	| ILine['id']
	| IRotate['id']
	| ILayout['id']
	| ITemplate['id']

export type IEntityType = designTypeEnum

export type IEntityParentType = IDesignWithType | IArtboardVersion

export type IEntityParentId = IDesignWithType['id'] | IArtboardVersion['id']

export const EntityParentIdType = {
	DESIGN_ID: 'designId',
	// ARTBOARD_ID: 'artboardId',
	ARTBOARD_VERSION_ID: 'artboardVersionId',
	LAYER_ID: 'layerId',
	// add more parent id types here
} as const
export type entityParentIdTypeEnum = ObjectValues<typeof EntityParentIdType>

export const EntityFormType = {
	HEX: 'hex',
	NUMBER: 'number',
	ICON: 'icon',
	MOVE_ICON: 'move-icon',
	SELECT: 'select',
	// add more form types here
} as const
export type entityFormTypeEnum = ObjectValues<typeof EntityFormType>

export type IEntityEnumSelectOption = {
	[x: string]: string
}
