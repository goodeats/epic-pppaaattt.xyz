import {
	type DeleteDesignSchemaType,
	DesignParentTypeIdEnum,
} from '#app/schema/design'
import { DeleteArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import {
	type entityParentIdTypeEnum,
	type DeleteEntitySchemaType,
	type entityActionTypeEnum,
	EntityActionType,
} from '#app/schema/entity'
import { type DeleteLayerSchemaType } from '#app/schema/layer'
import { DeleteArtboardVersionLayerSchema } from '#app/schema/layer-artboard-version'
import { Routes, type RoutePath } from '#app/utils/routes.utils'

export interface IDashboardPanelDeleteEntityStrategy {
	actionType: entityActionTypeEnum
	route: RoutePath
	parentTypeId: entityParentIdTypeEnum
	formId: string
	schema: DeleteEntitySchemaType
	iconText: string
}

export class DashboardPanelDeleteArtboardVersionDesignStrategy
	implements IDashboardPanelDeleteEntityStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.DELETE
	route: RoutePath = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.DELETE
	parentTypeId: entityParentIdTypeEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-design-delete'
	schema: DeleteDesignSchemaType = DeleteArtboardVersionDesignSchema
	iconText = 'Delete Design'
}

export class DashboardPanelDeleteArtboardVersionLayerStrategy
	implements IDashboardPanelDeleteEntityStrategy
{
	actionType: entityActionTypeEnum = EntityActionType.DELETE
	route: RoutePath = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.DELETE
	parentTypeId: entityParentIdTypeEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-layer-delete'
	schema: DeleteLayerSchemaType = DeleteArtboardVersionLayerSchema
	iconText = 'Delete Layer'
}
