import { type IDesignWithFill } from '#app/models/design/design.server'
import { EntityFormType, EntityParentIdType } from '#app/schema/entity'
import {
	EditDesignFillBasisSchema,
	EditDesignFillStyleSchema,
	EditDesignFillValueSchema,
	FillBasisTypeEnum,
	FillStyleTypeEnum,
} from '#app/schema/fill'
import { Routes } from '#app/utils/routes.const'
import { transformEntityEnumValueForSelect } from '#app/utils/string-formatting'
import {
	type IPanelEntityFormArgsOptionalMultiple,
	type IDashboardPanelUpdateEntityValuesStrategy,
	type IPanelEntityFormArgs,
} from './update-entity-values'

// console.log('Routes', Routes)
// const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE
// const globalEntityFormArgs = {
// 	parentTypeId: EntityParentIdType.DESIGN_ID,
// }
// const globalFillValueArgs = {
// 	route: baseRoute.VALUE,
// 	formType: EntityFormType.HEX,
// 	formId: 'design-type-update-fill-count',
// 	schema: EditDesignFillValueSchema,
// 	label: 'Value',
// }
// const globalFillBasisArgs = {
// 	route: baseRoute.BASIS,
// 	formType: EntityFormType.SELECT,
// 	formId: 'design-type-update-fill-basis',
// 	schema: EditDesignFillBasisSchema,
// 	label: 'Basis',
// }
// const globalFillStyleArgs = {
// 	route: baseRoute.STYLE,
// 	formType: EntityFormType.SELECT,
// 	formId: 'design-type-update-fill-style',
// 	schema: EditDesignFillStyleSchema,
// 	label: 'Style',
// }

export class DashboardPanelUpdateDesignTypeFillValuesStrategy
	implements IDashboardPanelUpdateEntityValuesStrategy
{
	getMainPanelForm({
		entity,
	}: {
		entity: IDesignWithFill
	}): IPanelEntityFormArgsOptionalMultiple {
		const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE
		const globalEntityFormArgs = {
			parentTypeId: EntityParentIdType.DESIGN_ID,
		}
		const globalFillValueArgs = {
			route: baseRoute.VALUE,
			formType: EntityFormType.HEX,
			formId: 'design-type-update-fill-count',
			schema: EditDesignFillValueSchema,
			label: 'Value',
		}
		const globalFillBasisArgs = {
			route: baseRoute.BASIS,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-fill-basis',
			schema: EditDesignFillBasisSchema,
			label: 'Basis',
		}
		const globalFillStyleArgs = {
			route: baseRoute.STYLE,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-fill-style',
			schema: EditDesignFillStyleSchema,
			label: 'Style',
		}

		const { fill } = entity
		const { value, basis, style } = fill

		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: fill.id,
			parentId: entity.id,
		}

		if (style === FillStyleTypeEnum.NONE) {
			const optionsStyle = Object.values(FillStyleTypeEnum).map(
				fillStyleEnum => ({
					[fillStyleEnum]: transformEntityEnumValueForSelect(fillStyleEnum),
				}),
			)
			const fillStyleArgs = {
				...sharedEntityFormArgs,
				...globalFillStyleArgs,
				options: optionsStyle,
				defaultValue: { style },
			}
			return fillStyleArgs
		}

		if (basis !== FillBasisTypeEnum.DEFINED) {
			const optionsBasis = Object.values(FillBasisTypeEnum).map(
				fillBasisEnum => ({
					[fillBasisEnum]: transformEntityEnumValueForSelect(fillBasisEnum),
				}),
			)

			const fillBasisArgs = {
				...sharedEntityFormArgs,
				...globalFillBasisArgs,
				options: optionsBasis,
				defaultValue: { basis },
			}
			return fillBasisArgs
		}

		const fillValueArgs = {
			...sharedEntityFormArgs,
			...globalFillValueArgs,
			defaultValue: { value },
		}
		return fillValueArgs
	}

	getPopoverForms({
		entity,
	}: {
		entity: IDesignWithFill
	}): IPanelEntityFormArgs[] {
		const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE
		const globalEntityFormArgs = {
			parentTypeId: EntityParentIdType.DESIGN_ID,
		}
		const globalFillValueArgs = {
			route: baseRoute.VALUE,
			formType: EntityFormType.HEX,
			formId: 'design-type-update-fill-count',
			schema: EditDesignFillValueSchema,
			label: 'Value',
		}

		const globalFillBasisArgs = {
			route: baseRoute.BASIS,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-fill-basis',
			schema: EditDesignFillBasisSchema,
			label: 'Basis',
		}
		const globalFillStyleArgs = {
			route: baseRoute.STYLE,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-fill-style',
			schema: EditDesignFillStyleSchema,
			label: 'Style',
		}

		const { fill } = entity
		const { value, basis, style } = fill
		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: fill.id,
			parentId: entity.id,
		}

		const fillValueArgs = {
			...sharedEntityFormArgs,
			...globalFillValueArgs,
			defaultValue: { value },
		}

		const optionsBasis = Object.values(FillBasisTypeEnum).map(
			fillBasisEnum => ({
				[fillBasisEnum]: transformEntityEnumValueForSelect(fillBasisEnum),
			}),
		)

		const fillBasisArgs = {
			...sharedEntityFormArgs,
			...globalFillBasisArgs,
			options: optionsBasis,
			defaultValue: { basis },
		}

		const optionsStyle = Object.values(FillStyleTypeEnum).map(
			fillStyleEnum => ({
				[fillStyleEnum]: transformEntityEnumValueForSelect(fillStyleEnum),
			}),
		)

		const fillStyleArgs = {
			...sharedEntityFormArgs,
			...globalFillStyleArgs,
			options: optionsStyle,
			defaultValue: { style },
		}

		return [fillValueArgs, fillBasisArgs, fillStyleArgs]
	}

	getPopoverTriggerColor({
		entity,
	}: {
		entity: IDesignWithFill
	}): string | undefined {
		const { fill } = entity
		const { basis, value } = fill
		const displayColor =
			basis === FillBasisTypeEnum.DEFINED && FillStyleTypeEnum.SOLID
		return displayColor ? value : undefined
	}

	getPanelFormatIcon({ entity }: { entity: IDesignWithFill }): undefined {
		return undefined
	}

	getPanelBasisIcon({ entity }: { entity: IDesignWithFill }): undefined {
		return undefined
	}
}
