import {
	PANEL_ENTITY_NEW_INTENT,
	type panelEntityNewIntent,
} from '#app/routes/resources+/api.v1+/panel.form.new-entity'
import { type NewDesignSchemaType } from '#app/schema/design'
import { NewArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import { Routes, type RoutePath } from '#app/utils/routes.utils'

export interface IDashboardPanelCreateEntityStrategy {
	route: RoutePath
	formId: string
	schema: NewDesignSchemaType // could also be layer
	intent: panelEntityNewIntent
	iconText: string
}

export class DashboardPanelCreateArtboardVersionDesignTypeStrategy
	implements IDashboardPanelCreateEntityStrategy
{
	route: RoutePath = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.CREATE
	formId: string = 'artboard-version-design-create'
	schema: NewDesignSchemaType = NewArtboardVersionDesignSchema
	intent: panelEntityNewIntent =
		PANEL_ENTITY_NEW_INTENT.createArtboardVersionDesignType
	iconText = 'Add New Design'
}
