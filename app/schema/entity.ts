import { type IArtboard } from '#app/models/artboard/artboard.server'
import { type IArtboardBranch } from '#app/models/artboard-branch/artboard-branch.server'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import {
	type IDesignWithType,
	type IDesign,
} from '#app/models/design/design.server'
import { type IFill } from '#app/models/design-type/fill/fill.server'
import { type ILayout } from '#app/models/design-type/layout/layout.server'
import { type ILine } from '#app/models/design-type/line/line.server'
import { type IPalette } from '#app/models/design-type/palette/palette.server'
import { type IRotate } from '#app/models/design-type/rotate/rotate.server'
import { type ISize } from '#app/models/design-type/size/size.server'
import { type IStroke } from '#app/models/design-type/stroke/stroke.server'
import { type ITemplate } from '#app/models/design-type/template/template.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { type IProject } from '#app/models/project/project.server'
import { type ObjectValues } from '#app/utils/typescript-helpers'
import {
	type ReorderDesignSchemaType,
	type NewDesignSchemaType,
	type designTypeEnum,
	type ToggleVisibleDesignSchemaType,
	type DeleteDesignSchemaType,
	type DesignParentType,
} from './design'
import {
	type ReorderLayerSchemaType,
	type NewLayerSchemaType,
	type ToggleVisibleLayerSchemaType,
	type DeleteLayerSchemaType,
	type SelectLayerSchemaType,
} from './layer'

export type IEntity =
	| ILayer
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
export type IEntitySelectable = ILayer
export type IEntityWithSlug =
	| IArtboard
	| IArtboardBranch
	| IArtboardVersion
	| IProject

export type IEntityId =
	| ILayer['id']
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

export type IEntityType = designTypeEnum | 'layer'

export type IEntityParentType =
	| IDesignWithType
	| IArtboardVersion
	| DesignParentType

export type IEntityParentId = IDesignWithType['id'] | IArtboardVersion['id']

export const EntityParentIdType = {
	PARENT_ID: 'parentId',
	DESIGN_ID: 'designId',
	ARTBOARD_ID: 'artboardId',
	ARTBOARD_BRANCH_ID: 'artboardBranchId',
	ARTBOARD_VERSION_ID: 'artboardVersionId',
	LAYER_ID: 'layerId',
	// add more parent id types here
} as const
export type entityParentIdTypeEnum = ObjectValues<typeof EntityParentIdType>

export const EntityFormType = {
	HEX: 'hex',
	TEXT: 'text',
	NUMBER: 'number',
	ICON: 'icon',
	MOVE_ICON: 'move-icon',
	SELECT: 'select',
	TEXTAREA: 'textarea',
	BUTTON: 'button',
	MULTIPLE: 'multiple',
	// add more form types here
} as const
export type entityFormTypeEnum = ObjectValues<typeof EntityFormType>

export type IEntityEnumSelectOption = {
	[x: string]: string
}

export type NewEntitySchemaType = NewDesignSchemaType | NewLayerSchemaType

export type ReorderEntitySchemaType =
	| ReorderDesignSchemaType
	| ReorderLayerSchemaType

// actions that go at end of the panel
export const EntityActionType = {
	DELETE: 'delete',
	TOGGLE_VISIBLE: 'toggle-visible',
	SELECT: 'select',
	// add more action types here
} as const
export type entityActionTypeEnum = ObjectValues<typeof EntityActionType>

export type EntityActionType =
	| ToggleVisibleEntitySchemaType
	| DeleteEntitySchemaType

export type ToggleVisibleEntitySchemaType =
	| ToggleVisibleDesignSchemaType
	| ToggleVisibleLayerSchemaType

export type DeleteEntitySchemaType =
	| DeleteDesignSchemaType
	| DeleteLayerSchemaType

export type SelectEntitySchemaType = SelectLayerSchemaType
