import { type IDesignWithStroke } from '#app/models/design.server'
import { EntityFormType, EntityParentIdType } from '#app/schema/entity'
import {
	EditDesignStrokeBasisSchema,
	EditDesignStrokeStyleSchema,
	EditDesignStrokeValueSchema,
	StrokeBasisTypeEnum,
	StrokeStyleTypeEnum,
} from '#app/schema/stroke'
import { Routes } from '#app/utils/routes.utils'
import { transformEntityEnumValueForSelect } from '#app/utils/string-formatting'
import {
	type IPanelEntityFormArgsOptionalMultiple,
	type IDashboardPanelUpdateEntityValuesStrategy,
	type IPanelEntityFormArgs,
} from './update-entity-values'

// const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE
// const globalEntityFormArgs = {
// 	parentTypeId: EntityParentIdType.DESIGN_ID,
// }
// const globalStrokeValueArgs = {
// 	route: baseRoute.VALUE,
// 	formType: EntityFormType.HEX,
// 	formId: 'design-type-update-stroke-count',
// 	schema: EditDesignStrokeValueSchema,
// 	label: 'Value',
// }
// const globalStrokeBasisArgs = {
// 	route: baseRoute.BASIS,
// 	formType: EntityFormType.SELECT,
// 	formId: 'design-type-update-stroke-basis',
// 	schema: EditDesignStrokeBasisSchema,
// 	label: 'Basis',
// }
// const globalStrokeStyleArgs = {
// 	route: baseRoute.STYLE,
// 	formType: EntityFormType.SELECT,
// 	formId: 'design-type-update-stroke-style',
// 	schema: EditDesignStrokeStyleSchema,
// 	label: 'Style',
// }

export class DashboardPanelUpdateDesignTypeStrokeValuesStrategy
	implements IDashboardPanelUpdateEntityValuesStrategy
{
	getMainPanelForm({
		entity,
	}: {
		entity: IDesignWithStroke
	}): IPanelEntityFormArgsOptionalMultiple {
		const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE
		const globalEntityFormArgs = {
			parentTypeId: EntityParentIdType.DESIGN_ID,
		}
		const globalStrokeValueArgs = {
			route: baseRoute.VALUE,
			formType: EntityFormType.HEX,
			formId: 'design-type-update-stroke-count',
			schema: EditDesignStrokeValueSchema,
			label: 'Value',
		}
		const globalStrokeBasisArgs = {
			route: baseRoute.BASIS,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-stroke-basis',
			schema: EditDesignStrokeBasisSchema,
			label: 'Basis',
		}

		const { stroke } = entity
		const { value, basis } = stroke

		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: stroke.id,
			parentId: entity.id,
		}

		if (basis !== StrokeBasisTypeEnum.DEFINED) {
			const optionsBasis = Object.values(StrokeBasisTypeEnum).map(
				strokeBasisEnum => ({
					[strokeBasisEnum]: transformEntityEnumValueForSelect(strokeBasisEnum),
				}),
			)

			const StrokeBasisArgs = {
				...sharedEntityFormArgs,
				...globalStrokeBasisArgs,
				options: optionsBasis,
				defaultValue: { basis },
			}
			return StrokeBasisArgs
		}

		const StrokeValueArgs = {
			...sharedEntityFormArgs,
			...globalStrokeValueArgs,
			defaultValue: { value },
		}
		return StrokeValueArgs
	}

	getPopoverForms({
		entity,
	}: {
		entity: IDesignWithStroke
	}): IPanelEntityFormArgs[] {
		const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE
		const globalEntityFormArgs = {
			parentTypeId: EntityParentIdType.DESIGN_ID,
		}
		const globalStrokeValueArgs = {
			route: baseRoute.VALUE,
			formType: EntityFormType.HEX,
			formId: 'design-type-update-stroke-count',
			schema: EditDesignStrokeValueSchema,
			label: 'Value',
		}
		const globalStrokeBasisArgs = {
			route: baseRoute.BASIS,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-stroke-basis',
			schema: EditDesignStrokeBasisSchema,
			label: 'Basis',
		}
		const globalStrokeStyleArgs = {
			route: baseRoute.STYLE,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-stroke-style',
			schema: EditDesignStrokeStyleSchema,
			label: 'Style',
		}

		const { stroke } = entity
		const { value, basis, style } = stroke
		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: stroke.id,
			parentId: entity.id,
		}

		const StrokeValueArgs = {
			...sharedEntityFormArgs,
			...globalStrokeValueArgs,
			defaultValue: { value },
		}

		const optionsBasis = Object.values(StrokeBasisTypeEnum).map(
			strokeBasisEnum => ({
				[strokeBasisEnum]: transformEntityEnumValueForSelect(strokeBasisEnum),
			}),
		)

		const StrokeBasisArgs = {
			...sharedEntityFormArgs,
			...globalStrokeBasisArgs,
			options: optionsBasis,
			defaultValue: { basis },
		}

		const optionsStyle = Object.values(StrokeStyleTypeEnum).map(
			strokeStyleEnum => ({
				[strokeStyleEnum]: transformEntityEnumValueForSelect(strokeStyleEnum),
			}),
		)

		const StrokeStyleArgs = {
			...sharedEntityFormArgs,
			...globalStrokeStyleArgs,
			options: optionsStyle,
			defaultValue: { style },
		}

		return [StrokeValueArgs, StrokeBasisArgs, StrokeStyleArgs]
	}

	getPopoverTriggerColor({
		entity,
	}: {
		entity: IDesignWithStroke
	}): string | undefined {
		const { stroke } = entity
		const { basis, value } = stroke
		const displayColor =
			basis === StrokeBasisTypeEnum.DEFINED && StrokeStyleTypeEnum.SOLID
		return displayColor ? value : undefined
	}

	getPanelFormatIcon({ entity }: { entity: IDesignWithStroke }): undefined {
		return undefined
	}

	getPanelBasisIcon({ entity }: { entity: IDesignWithStroke }): undefined {
		return undefined
	}
}
