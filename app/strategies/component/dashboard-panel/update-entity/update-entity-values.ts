import { type z } from 'zod'
import {
	type IDesignWithLayout,
	type IDesignWithType,
} from '#app/models/design.server'
import { EditDesignLayoutCountSchema } from '#app/schema/layout'
import { type defaultValueStringOrNumber } from '#app/schema/zod-helpers'
import { Routes, type RoutePath } from '#app/utils/routes.utils'

export interface IPanelEntityFormArgs {
	route: RoutePath
	formType: 'hex' | 'number' | 'string'
	defaultValue: defaultValueStringOrNumber
	entityId: string
	parentId: string
	parentTypeId: 'designId'
	formId: string
	schema: z.ZodSchema<any>
	label?: string
}
export interface IDashboardPanelUpdateEntityValuesStrategy {
	getMainPanelForm(args: { entity: IDesignWithType }): IPanelEntityFormArgs
	getPopoverForms(args: { entity: IDesignWithType }): IPanelEntityFormArgs[]
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
			formType: 'number',
			defaultValue: { count: layout.count },
			entityId: layout.id,
			parentId: entity.id,
			parentTypeId: 'designId',
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
		// const style = layout.style === 'random' ? 'count' : 'rows'
		return [
			{
				route: Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.COUNT,
				formType: 'number',
				defaultValue: { count: layout.count },
				entityId: layout.id,
				parentId: entity.id,
				parentTypeId: 'designId',
				formId: 'design-type-update-layout-count',
				schema: EditDesignLayoutCountSchema,
				label: 'Count',
			},
		]
	}
}
