import { type IDesignWithTemplate } from '#app/models/design/design.server'
import { EntityFormType, EntityParentIdType } from '#app/schema/entity'
import {
	EditDesignTemplateStyleSchema,
	TemplateStyleTypeEnum,
} from '#app/schema/template'
import { Routes } from '#app/utils/routes.utils'
import { transformEntityEnumValueForSelect } from '#app/utils/string-formatting'
import {
	type IPanelEntityFormArgsOptionalMultiple,
	type IDashboardPanelUpdateEntityValuesStrategy,
	type IPanelEntityFormArgs,
} from './update-entity-values'

// const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.TEMPLATE.UPDATE
// const globalEntityFormArgs = {
// 	parentTypeId: EntityParentIdType.DESIGN_ID,
// }
// const globalTemplateStyleArgs = {
// 	route: baseRoute.STYLE,
// 	formType: EntityFormType.SELECT,
// 	formId: 'design-type-update-template-style',
// 	schema: EditDesignTemplateStyleSchema,
// 	label: 'Style',
// }

export class DashboardPanelUpdateDesignTypeTemplateValuesStrategy
	implements IDashboardPanelUpdateEntityValuesStrategy
{
	getMainPanelForm({
		entity,
	}: {
		entity: IDesignWithTemplate
	}): IPanelEntityFormArgsOptionalMultiple {
		const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.TEMPLATE.UPDATE
		const globalEntityFormArgs = {
			parentTypeId: EntityParentIdType.DESIGN_ID,
		}
		const globalTemplateStyleArgs = {
			route: baseRoute.STYLE,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-template-style',
			schema: EditDesignTemplateStyleSchema,
			label: 'Style',
		}

		const { template } = entity
		const { style } = template

		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: template.id,
			parentId: entity.id,
		}

		const optionsStyle = Object.values(TemplateStyleTypeEnum).map(
			templateStyleEnum => ({
				[templateStyleEnum]:
					transformEntityEnumValueForSelect(templateStyleEnum),
			}),
		)
		const templateStyleArgs = {
			...sharedEntityFormArgs,
			...globalTemplateStyleArgs,
			options: optionsStyle,
			defaultValue: { style },
		}
		return templateStyleArgs
	}

	getPopoverForms({
		entity,
	}: {
		entity: IDesignWithTemplate
	}): IPanelEntityFormArgs[] {
		const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.TEMPLATE.UPDATE
		const globalEntityFormArgs = {
			parentTypeId: EntityParentIdType.DESIGN_ID,
		}
		const globalTemplateStyleArgs = {
			route: baseRoute.STYLE,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-template-style',
			schema: EditDesignTemplateStyleSchema,
			label: 'Style',
		}

		const { template } = entity
		const { style } = template
		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: template.id,
			parentId: template.id,
		}

		const optionsStyle = Object.values(TemplateStyleTypeEnum).map(
			templateStyleEnum => ({
				[templateStyleEnum]:
					transformEntityEnumValueForSelect(templateStyleEnum),
			}),
		)

		const templateStyleArgs = {
			...sharedEntityFormArgs,
			...globalTemplateStyleArgs,
			options: optionsStyle,
			defaultValue: { style },
		}

		return [templateStyleArgs]
	}

	getPopoverTriggerColor({
		entity,
	}: {
		entity: IDesignWithTemplate
	}): undefined {
		return undefined
	}

	getPanelFormatIcon({ entity }: { entity: IDesignWithTemplate }): undefined {
		return undefined
	}

	getPanelBasisIcon({ entity }: { entity: IDesignWithTemplate }): undefined {
		return undefined
	}
}
