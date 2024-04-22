import { type z } from 'zod'
import {
	type IDesignWithLayout,
	type IDesignWithType,
} from '#app/models/design.server'
import { EditDesignLayoutCountSchema } from '#app/schema/layout'
import {
	type defaultValueNumber,
	type defaultValueStringOrNumber,
} from '#app/schema/zod-helpers'
import { Routes, type RoutePath } from '#app/utils/routes.utils'

export interface IDashboardPanelUpdateEntityValuesStrategy {
	getMainPanelForm(args: { entity: IDesignWithType }): {
		route: RoutePath
		defaultValue: defaultValueStringOrNumber
		entityId: string
		parentId: string
		parentTypeId: 'designId'
		formId: string
		schema: z.ZodSchema<any>
	}
}

export class DashboardPanelUpdateDesignTypeLayoutValuesStrategy
	implements IDashboardPanelUpdateEntityValuesStrategy
{
	getMainPanelForm({ entity }: { entity: IDesignWithLayout }): {
		route: RoutePath
		defaultValue: defaultValueNumber
		entityId: string
		parentId: string
		parentTypeId: 'designId'
		formId: string
		schema: z.ZodSchema<any>
	} {
		const { layout } = entity
		// const style = layout.style === 'random' ? 'count' : 'rows'
		// console.log(style)

		return {
			route: Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.COUNT,
			defaultValue: { count: layout.count },
			entityId: layout.id,
			parentId: entity.id,
			parentTypeId: 'designId',
			formId: 'design-type-update-layout-count',
			schema: EditDesignLayoutCountSchema,
		}
	}
}
