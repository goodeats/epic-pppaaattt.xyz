import {
	type DeleteDesignSchemaType,
	DesignParentTypeIdEnum,
} from '#app/schema/design'
import { DeleteArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import {
	type entityParentIdTypeEnum,
	type DeleteEntitySchemaType,
} from '#app/schema/entity'
import { type DeleteLayerSchemaType } from '#app/schema/layer'
import { DeleteArtboardVersionLayerSchema } from '#app/schema/layer-artboard-version'
import { Routes, type RoutePath } from '#app/utils/routes.utils'

export interface IDashboardPanelDeleteEntityStrategy {
	route: RoutePath
	parentTypeId: entityParentIdTypeEnum
	formId: string
	schema: DeleteEntitySchemaType
	iconText: string
}

export class DashboardPanelDeleteArtboardVersionDesignTypeStrategy
	implements IDashboardPanelDeleteEntityStrategy
{
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
	route: RoutePath = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.DELETE
	parentTypeId: entityParentIdTypeEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-layer-delete'
	schema: DeleteLayerSchemaType = DeleteArtboardVersionLayerSchema
	iconText = 'Add New Layer'
}
