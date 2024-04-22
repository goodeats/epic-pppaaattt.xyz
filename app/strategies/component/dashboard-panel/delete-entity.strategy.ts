import {
	type DeleteDesignSchemaType,
	DesignParentTypeIdEnum,
	type designParentTypeIdEnum,
} from '#app/schema/design'
import { DeleteArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import { Routes, type RoutePath } from '#app/utils/routes.utils'

export interface IDashboardPanelDeleteEntityStrategy {
	route: RoutePath
	parentTypeId: designParentTypeIdEnum
	formId: string
	schema: DeleteDesignSchemaType // could also be layer
	iconText: string
}

export class DashboardPanelDeleteArtboardVersionDesignTypeStrategy
	implements IDashboardPanelDeleteEntityStrategy
{
	route: RoutePath = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.DELETE
	parentTypeId: designParentTypeIdEnum =
		DesignParentTypeIdEnum.ARTBOARD_VERSION_ID
	formId: string = 'artboard-version-design-delete'
	schema: DeleteDesignSchemaType = DeleteArtboardVersionDesignSchema
	iconText = 'Add New Design'
}
