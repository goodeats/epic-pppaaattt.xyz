import {
	PANEL_ENTITY_NEW_INTENT,
	type panelEntityNewIntent,
} from '#app/routes/resources+/api.v1+/panel.form.new-entity'
import { type NewDesignSchemaType } from '#app/schema/design'
import { NewArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'

export interface IDashboardPanelCreateEntityStrategy {
	schema: NewDesignSchemaType // could also be layer
	intent: panelEntityNewIntent
	iconText: string
}

export class DashboardPanelCreateArtboardVersionDesignTypeStrategy
	implements IDashboardPanelCreateEntityStrategy
{
	schema: NewDesignSchemaType = NewArtboardVersionDesignSchema
	intent: panelEntityNewIntent =
		PANEL_ENTITY_NEW_INTENT.createArtboardVersionDesignType
	iconText = 'Add New Design'
}
