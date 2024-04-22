import { type IDesignWithPalette } from '#app/models/design.server'
import { EntityFormType, EntityParentIdType } from '#app/schema/entity'
import { EditDesignPaletteValueSchema } from '#app/schema/palette'
import { Routes } from '#app/utils/routes.utils'
import {
	type IPanelEntityFormArgsOptionalMultiple,
	type IDashboardPanelUpdateEntityValuesStrategy,
	type IPanelEntityFormArgs,
} from './update-entity-values'

const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.PALETTE.UPDATE
const globalEntityFormArgs = {
	parentTypeId: EntityParentIdType.DESIGN_ID,
}
const globalPaletteValueArgs = {
	route: baseRoute.VALUE,
	formType: EntityFormType.HEX,
	formId: 'design-type-update-palette-value',
	schema: EditDesignPaletteValueSchema,
	label: 'Hex',
}

export class DashboardPanelUpdateDesignTypePaletteValuesStrategy
	implements IDashboardPanelUpdateEntityValuesStrategy
{
	getMainPanelForm({
		entity,
	}: {
		entity: IDesignWithPalette
	}): IPanelEntityFormArgsOptionalMultiple {
		const { palette } = entity
		const { value } = palette

		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: palette.id,
			parentId: entity.id,
		}

		const paletteValueArgs = {
			...sharedEntityFormArgs,
			...globalPaletteValueArgs,
			defaultValue: { value },
		}

		return paletteValueArgs
	}

	getPopoverForms({
		entity,
	}: {
		entity: IDesignWithPalette
	}): IPanelEntityFormArgs[] {
		const { palette } = entity
		const { value } = palette

		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: palette.id,
			parentId: entity.id,
		}

		const paletteValueArgs = {
			...sharedEntityFormArgs,
			...globalPaletteValueArgs,
			defaultValue: { value },
		}

		return [paletteValueArgs]
	}

	getPopoverTriggerColor({
		entity,
	}: {
		entity: IDesignWithPalette
	}): string | undefined {
		return entity.palette.value
	}
}
