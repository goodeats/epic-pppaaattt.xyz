import { type IconName } from '#app/components/ui/icon'
import { type ILayer } from '#app/models/layer/layer.server'
import { EntityFormType, EntityParentIdType } from '#app/schema/entity'
import {
	EditLayerDescriptionSchema,
	EditLayerNameSchema,
} from '#app/schema/layer'
import { DeleteArtboardVersionLayerSchema } from '#app/schema/layer-artboard-version'
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
const globalLayerDeleteArgs = {
	route: Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.DELETE,
	formType: EntityFormType.BUTTON,
	formId: 'artboard-version-delete-layer',
	schema: DeleteArtboardVersionLayerSchema,
	label: 'Delete',
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

		const layerDeleteArgs = {
			...sharedEntityFormArgs,
			...globalLayerDeleteArgs,
			parentId: entity.artboardVersionId || undefined,
			icon: 'trash' as IconName,
			buttonText: 'Delete',
			buttonVariant: 'destructive' as
				| 'destructive'
				| 'default'
				| 'link'
				| 'outline'
				| 'secondary'
				| 'ghost'
				| null
				| undefined,
		}

		return [layerNameArgs, layerDescriptionArgs, layerDeleteArgs]
	}

	getPopoverTriggerColor(): undefined {
		return undefined
	}

	getPanelFormatIcon(): undefined {
		return undefined
	}

	getPanelBasisIcon(): undefined {
		return undefined
	}
}
