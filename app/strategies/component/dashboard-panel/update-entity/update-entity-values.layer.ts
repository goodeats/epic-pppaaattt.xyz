import { type ILayer } from '#app/models/layer.server'
import { EntityFormType, EntityParentIdType } from '#app/schema/entity'
import {
	EditLayerDescriptionSchema,
	EditLayerNameSchema,
} from '#app/schema/layer'
import { Routes } from '#app/utils/routes.utils'
import {
	type IPanelEntityFormArgsOptionalMultiple,
	type IDashboardPanelUpdateEntityValuesStrategy,
	type IPanelEntityFormArgs,
} from './update-entity-values'

const baseRoute = Routes.RESOURCES.API.V1.LAYER.UPDATE
const globalEntityFormArgs = {
	parentTypeId: EntityParentIdType.ARTBOARD_VERSION_ID,
}
const globalLayerNameArgs = {
	route: baseRoute.NAME,
	formType: EntityFormType.TEXT,
	formId: 'layer-update-name',
	schema: EditLayerNameSchema,
	label: 'Name',
}
const globalLayerDescriptionArgs = {
	route: baseRoute.DESCRIPTION,
	formType: EntityFormType.TEXTAREA,
	formId: 'layer-update-description',
	schema: EditLayerDescriptionSchema,
	label: 'Description',
}

export class DashboardPanelUpdateLayerValuesStrategy
	implements IDashboardPanelUpdateEntityValuesStrategy
{
	getMainPanelForm({
		entity,
	}: {
		entity: ILayer
	}): IPanelEntityFormArgsOptionalMultiple {
		const { name } = entity
		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: entity.id,
		}

		const layerNameArgs = {
			...sharedEntityFormArgs,
			...globalLayerNameArgs,
			defaultValue: { name },
		}
		return layerNameArgs
	}

	getPopoverForms({ entity }: { entity: ILayer }): IPanelEntityFormArgs[] {
		const { name, description } = entity
		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: entity.id,
		}

		const layerNameArgs = {
			...sharedEntityFormArgs,
			...globalLayerNameArgs,
			defaultValue: { name },
		}

		const layerDescriptionArgs = {
			...sharedEntityFormArgs,
			...globalLayerDescriptionArgs,
			defaultValue: { description },
		}

		return [layerNameArgs, layerDescriptionArgs]
	}

	getPopoverTriggerColor({ entity }: { entity: ILayer }): undefined {
		return undefined
	}

	getPanelFormatIcon({ entity }: { entity: ILayer }): undefined {
		return undefined
	}

	getPanelBasisIcon({ entity }: { entity: ILayer }): undefined {
		return undefined
	}
}
