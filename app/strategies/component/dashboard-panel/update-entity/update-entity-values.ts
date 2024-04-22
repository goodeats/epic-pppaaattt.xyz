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
} from '#app/schema/entity'
import {
	EditDesignLayoutCountSchema,
	EditDesignLayoutRowsSchema,
} from '#app/schema/layout'
import { type defaultValueStringOrNumber } from '#app/schema/zod-helpers'
import { Routes, type RoutePath } from '#app/utils/routes.utils'

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
}
export interface IDashboardPanelUpdateEntityValuesStrategy {
	getMainPanelForm(args: { entity: IEntity }): IPanelEntityFormArgs
	getPopoverForms(args: { entity: IEntity }): IPanelEntityFormArgs[]
}

export class DashboardPanelUpdateDesignTypeLayoutValuesStrategy
	implements IDashboardPanelUpdateEntityValuesStrategy
{
	getMainPanelForm({
		entity,
	}: {
		entity: IDesignWithLayout
	}): IPanelEntityFormArgs {
		const { layout } = entity
		// const style = layout.style === 'random' ? 'count' : 'rows'
		return {
			route: Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.COUNT,
			formType: EntityFormType.NUMBER,
			defaultValue: { count: layout.count },
			entityId: layout.id,
			parentId: entity.id,
			parentTypeId: EntityParentIdType.DESIGN_ID,
			formId: 'design-type-update-layout-count',
			schema: EditDesignLayoutCountSchema,
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

		const layoutCountArgs = {
			...sharedntityFormArgs,
			route: baseRoute.COUNT,
			formType: EntityFormType.NUMBER,
			defaultValue: { count: layout.count },
			formId: 'design-type-update-layout-count',
			schema: EditDesignLayoutCountSchema,
			label: 'Count',
		}

		const layoutRowArgs = {
			...sharedntityFormArgs,
			route: baseRoute.ROWS,
			formType: EntityFormType.NUMBER,
			defaultValue: { rows: layout.rows },
			formId: 'design-type-update-layout-rows',
			schema: EditDesignLayoutRowsSchema,
			label: 'Rows',
		}

		return [layoutCountArgs, layoutRowArgs]
	}
}
