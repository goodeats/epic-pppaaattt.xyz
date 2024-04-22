import { type IDesignWithLayout } from '#app/models/design.server'
import { EntityFormType, EntityParentIdType } from '#app/schema/entity'
import {
	EditDesignLayoutColumnsSchema,
	EditDesignLayoutCountSchema,
	EditDesignLayoutRowsSchema,
	EditDesignLayoutStyleSchema,
	LayoutStyleTypeEnum,
} from '#app/schema/layout'
import { Routes } from '#app/utils/routes.utils'
import { transformEntityEnumValueForSelect } from '#app/utils/string-formatting'
import {
	type IPanelEntityFormArgsOptionalMultiple,
	type IDashboardPanelUpdateEntityValuesStrategy,
	type IPanelEntityFormArgs,
} from './update-entity-values'

const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
const globalEntityFormArgs = {
	parentTypeId: EntityParentIdType.DESIGN_ID,
}
const globalLayoutCountArgs = {
	route: baseRoute.COUNT,
	formType: EntityFormType.NUMBER,
	formId: 'design-type-update-layout-count',
	schema: EditDesignLayoutCountSchema,
	label: 'Count',
}
const globalLayoutRowsArgs = {
	route: baseRoute.ROWS,
	formType: EntityFormType.NUMBER,
	formId: 'design-type-update-layout-rows',
	schema: EditDesignLayoutRowsSchema,
	label: 'Rows',
}
const globalLayoutColumnsArgs = {
	route: baseRoute.COLUMNS,
	formType: EntityFormType.NUMBER,
	formId: 'design-type-update-layout-columns',
	schema: EditDesignLayoutColumnsSchema,
	label: 'Columns',
}
const globalLayoutStyleArgs = {
	route: baseRoute.STYLE,
	formType: EntityFormType.SELECT,
	formId: 'design-type-update-layout-style',
	schema: EditDesignLayoutStyleSchema,
	label: 'Style',
}

export class DashboardPanelUpdateDesignTypeLayoutValuesStrategy
	implements IDashboardPanelUpdateEntityValuesStrategy
{
	getMainPanelForm({
		entity,
	}: {
		entity: IDesignWithLayout
	}): IPanelEntityFormArgsOptionalMultiple {
		const { layout } = entity
		const { style } = layout

		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: layout.id,
			parentId: entity.id,
		}

		const layoutCountArgs = {
			...sharedEntityFormArgs,
			...globalLayoutCountArgs,
			defaultValue: { count: layout.count },
		}

		const layoutRowsArgs = {
			...sharedEntityFormArgs,
			...globalLayoutRowsArgs,
			defaultValue: { rows: layout.rows },
		}

		const layoutColumnsArgs = {
			...sharedEntityFormArgs,
			...globalLayoutColumnsArgs,
			defaultValue: { columns: layout.columns },
		}

		if (style === 'random') {
			return layoutCountArgs
		} else {
			return {
				formType: EntityFormType.MULTIPLE,
				forms: [layoutRowsArgs, layoutColumnsArgs],
			}
		}
	}

	getPopoverForms({
		entity,
	}: {
		entity: IDesignWithLayout
	}): IPanelEntityFormArgs[] {
		const { layout } = entity
		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: layout.id,
			parentId: entity.id,
		}

		const options = Object.values(LayoutStyleTypeEnum).map(layoutStyleEnum => ({
			[layoutStyleEnum]: transformEntityEnumValueForSelect(layoutStyleEnum),
		}))

		const layoutStyleArgs = {
			...sharedEntityFormArgs,
			...globalLayoutStyleArgs,
			options,
			defaultValue: { style: layout.style },
		}

		const layoutCountArgs = {
			...sharedEntityFormArgs,
			...globalLayoutCountArgs,
			defaultValue: { count: layout.count },
		}

		const layoutRowsArgs = {
			...sharedEntityFormArgs,
			...globalLayoutRowsArgs,
			defaultValue: { rows: layout.rows },
		}

		const layoutColumnsArgs = {
			...sharedEntityFormArgs,
			...globalLayoutColumnsArgs,
			defaultValue: { columns: layout.columns },
		}

		return [layoutStyleArgs, layoutCountArgs, layoutRowsArgs, layoutColumnsArgs]
	}

	getPopoverTriggerColor({ entity }: { entity: IDesignWithLayout }): undefined {
		return undefined
	}

	getPanelFormatIcon({ entity }: { entity: IDesignWithLayout }): undefined {
		return undefined
	}

	getPanelBasisIcon({ entity }: { entity: IDesignWithLayout }): undefined {
		return undefined
	}
}
