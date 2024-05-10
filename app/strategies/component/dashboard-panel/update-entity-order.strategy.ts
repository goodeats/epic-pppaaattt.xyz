import {
	DesignParentTypeIdEnum,
	type ReorderDesignSchemaType,
} from '#app/schema/design'
import { ReorderArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import { ReorderLayerDesignSchema } from '#app/schema/design-layer'
import {
	type ReorderEntitySchemaType,
	type entityParentIdTypeEnum,
} from '#app/schema/entity'
import { type ReorderLayerSchemaType } from '#app/schema/layer'
import { ReorderArtboardVersionLayerSchema } from '#app/schema/layer-artboard-version'
import { Routes, type RoutePath } from '#app/utils/routes.utils'

export interface IDashboardPanelUpdateEntityOrderStrategy {
	route: RoutePath
	parentTypeId: entityParentIdTypeEnum
	formId: string
	schema: ReorderEntitySchemaType
	iconText: string
}

export class DashboardPanelUpdateArtboardVersionDesignTypeOrderStrategy
	implements IDashboardPanelUpdateEntityOrderStrategy
{
	route: RoutePath =
		Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.UPDATE.ORDER
	parentTypeId: entityParentIdTypeEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-design-update-order'
	schema: ReorderDesignSchemaType = ReorderArtboardVersionDesignSchema
	iconText = 'Move'
}

export class DashboardPanelUpdateArtboardVersionLayerTypeOrderStrategy
	implements IDashboardPanelUpdateEntityOrderStrategy
{
	route: RoutePath = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.UPDATE.ORDER
	parentTypeId: entityParentIdTypeEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-layer-update-order'
	schema: ReorderLayerSchemaType = ReorderArtboardVersionLayerSchema
	iconText = 'Move'
}

export class DashboardPanelUpdateLayerDesignTypeOrderStrategy
	implements IDashboardPanelUpdateEntityOrderStrategy
{
	route: RoutePath = Routes.RESOURCES.API.V1.LAYER.DESIGN.UPDATE.ORDER
	parentTypeId: entityParentIdTypeEnum = DesignParentTypeIdEnum.LAYER_ID
	formId: string = 'layer-design-update-order'
	schema: ReorderDesignSchemaType = ReorderLayerDesignSchema
	iconText = 'Move'
}
