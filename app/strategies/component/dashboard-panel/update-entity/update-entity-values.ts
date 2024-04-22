import { type z } from 'zod'
import { type IDesignWithLayout } from '#app/models/design.server'
import {
	EntityFormType,
	type entityParentIdTypeEnum,
	type entityFormTypeEnum,
	EntityParentIdType,
	type IEntityId,
	type IEntityParentId,
	type IEntity,
	type IEntityEnumSelectOption,
} from '#app/schema/entity'
import {
	EditDesignLayoutColumnsSchema,
	EditDesignLayoutCountSchema,
	EditDesignLayoutRowsSchema,
	EditDesignLayoutStyleSchema,
	LayoutStyleTypeEnum,
} from '#app/schema/layout'
import { type defaultValueStringOrNumber } from '#app/schema/zod-helpers'
import { Routes, type RoutePath } from '#app/utils/routes.utils'
import { transformEntityEnumValueForSelect } from '#app/utils/string-formatting'

export interface IPanelEntityFormArgs {
	route: RoutePath
	formType: entityFormTypeEnum
	defaultValue: defaultValueStringOrNumber
	entityId: IEntityId
	parentId: IEntityParentId
	parentTypeId: entityParentIdTypeEnum
	formId: string
	schema: z.ZodSchema<any>
	label?: string
	options?: IEntityEnumSelectOption[]
}

export interface IPanelEntityFormArgsMultiple {
	formType: entityFormTypeEnum // MULTIPLE
	forms: IPanelEntityFormArgs[]
}

export type IPanelEntityFormArgsOptionalMultiple =
	| IPanelEntityFormArgsMultiple
	| IPanelEntityFormArgs
export interface IDashboardPanelUpdateEntityValuesStrategy {
	getMainPanelForm(args: {
		entity: IEntity
	}): IPanelEntityFormArgsOptionalMultiple
	getPopoverForms(args: { entity: IEntity }): IPanelEntityFormArgs[]
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

		const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		const sharedntityFormArgs = {
			entityId: layout.id,
			parentId: entity.id,
			parentTypeId: EntityParentIdType.DESIGN_ID,
		}

		const layoutCountArgs = {
			...sharedntityFormArgs,
			route: baseRoute.COUNT,
			formType: EntityFormType.NUMBER,
			defaultValue: { count: layout.count },
			formId: 'design-type-update-layout-count',
			schema: EditDesignLayoutCountSchema,
			label: 'Count',
		}

		const layoutRowsArgs = {
			...sharedntityFormArgs,
			route: baseRoute.ROWS,
			formType: EntityFormType.NUMBER,
			defaultValue: { rows: layout.rows },
			formId: 'design-type-update-layout-rows',
			schema: EditDesignLayoutRowsSchema,
			label: 'Rows',
		}

		const layoutColumnsArgs = {
			...sharedntityFormArgs,
			route: baseRoute.COLUMNS,
			formType: EntityFormType.NUMBER,
			defaultValue: { columns: layout.columns },
			formId: 'design-type-update-layout-columns',
			schema: EditDesignLayoutColumnsSchema,
			label: 'Columns',
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
		const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE
		const sharedntityFormArgs = {
			entityId: layout.id,
			parentId: entity.id,
			parentTypeId: EntityParentIdType.DESIGN_ID,
		}

		const options = Object.values(LayoutStyleTypeEnum).map(layoutStyleEnum => ({
			[layoutStyleEnum]: transformEntityEnumValueForSelect(layoutStyleEnum),
		}))

		const layoutStyleArgs = {
			...sharedntityFormArgs,
			route: baseRoute.STYLE,
			formType: EntityFormType.SELECT,
			options,
			defaultValue: { style: layout.style },
			formId: 'design-type-update-layout-style',
			schema: EditDesignLayoutStyleSchema,
			label: 'Style',
		}

		const layoutCountArgs = {
			...sharedntityFormArgs,
			route: baseRoute.COUNT,
			formType: EntityFormType.NUMBER,
			defaultValue: { count: layout.count },
			formId: 'design-type-update-layout-count',
			schema: EditDesignLayoutCountSchema,
			label: 'Count',
		}

		const layoutRowsArgs = {
			...sharedntityFormArgs,
			route: baseRoute.ROWS,
			formType: EntityFormType.NUMBER,
			defaultValue: { rows: layout.rows },
			formId: 'design-type-update-layout-rows',
			schema: EditDesignLayoutRowsSchema,
			label: 'Rows',
		}

		const layoutColumnsArgs = {
			...sharedntityFormArgs,
			route: baseRoute.COLUMNS,
			formType: EntityFormType.NUMBER,
			defaultValue: { columns: layout.columns },
			formId: 'design-type-update-layout-columns',
			schema: EditDesignLayoutColumnsSchema,
			label: 'Columns',
		}

		return [layoutStyleArgs, layoutCountArgs, layoutRowsArgs, layoutColumnsArgs]
	}
}
