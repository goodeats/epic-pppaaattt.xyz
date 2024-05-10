import { type IconName } from '#app/components/ui/icon'
import { type IDesignWithLine } from '#app/models/design/design.server'
import { EntityFormType, EntityParentIdType } from '#app/schema/entity'
import {
	EditDesignLineBasisSchema,
	EditDesignLineFormatSchema,
	EditDesignLineWidthSchema,
	LineBasisTypeEnum,
	LineFormatTypeEnum,
	lineBasisIcon,
	type lineBasisTypeEnum,
	lineFormatIcon,
	type lineFormatTypeEnum,
} from '#app/schema/line'
import { Routes } from '#app/utils/routes.utils'
import { transformEntityEnumValueForSelect } from '#app/utils/string-formatting'
import {
	type IPanelEntityFormArgsOptionalMultiple,
	type IDashboardPanelUpdateEntityValuesStrategy,
	type IPanelEntityFormArgs,
	type IDashboardPanelIcon,
} from './update-entity-values'

// const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE
// const globalEntityFormArgs = {
// 	parentTypeId: EntityParentIdType.DESIGN_ID,
// }
// const globalLineWidthArgs = {
// 	route: baseRoute.WIDTH,
// 	formType: EntityFormType.NUMBER,
// 	formId: 'design-type-update-line-width',
// 	schema: EditDesignLineWidthSchema,
// 	label: 'Width',
// }
// const globalLineBasisArgs = {
// 	route: baseRoute.BASIS,
// 	formType: EntityFormType.SELECT,
// 	formId: 'design-type-update-line-basis',
// 	schema: EditDesignLineBasisSchema,
// 	label: 'Basis',
// }
// const globalLineFormatArgs = {
// 	route: baseRoute.FORMAT,
// 	formType: EntityFormType.SELECT,
// 	formId: 'design-type-update-line-format',
// 	schema: EditDesignLineFormatSchema,
// 	label: 'Style',
// }

export class DashboardPanelUpdateDesignTypeLineValuesStrategy
	implements IDashboardPanelUpdateEntityValuesStrategy
{
	getMainPanelForm({
		entity,
	}: {
		entity: IDesignWithLine
	}): IPanelEntityFormArgsOptionalMultiple {
		const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE
		const globalEntityFormArgs = {
			parentTypeId: EntityParentIdType.DESIGN_ID,
		}
		const globalLineWidthArgs = {
			route: baseRoute.WIDTH,
			formType: EntityFormType.NUMBER,
			formId: 'design-type-update-line-width',
			schema: EditDesignLineWidthSchema,
			label: 'Width',
		}

		const { line } = entity
		const { width } = line

		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: line.id,
			parentId: entity.id,
		}

		const LineWidthArgs = {
			...sharedEntityFormArgs,
			...globalLineWidthArgs,
			defaultValue: { width },
		}
		return LineWidthArgs
	}

	getPopoverForms({
		entity,
	}: {
		entity: IDesignWithLine
	}): IPanelEntityFormArgs[] {
		const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE
		const globalEntityFormArgs = {
			parentTypeId: EntityParentIdType.DESIGN_ID,
		}
		const globalLineWidthArgs = {
			route: baseRoute.WIDTH,
			formType: EntityFormType.NUMBER,
			formId: 'design-type-update-line-width',
			schema: EditDesignLineWidthSchema,
			label: 'Width',
		}
		const globalLineBasisArgs = {
			route: baseRoute.BASIS,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-line-basis',
			schema: EditDesignLineBasisSchema,
			label: 'Basis',
		}
		const globalLineFormatArgs = {
			route: baseRoute.FORMAT,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-line-format',
			schema: EditDesignLineFormatSchema,
			label: 'Style',
		}

		const { line } = entity
		const { width, basis, format } = line
		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: line.id,
			parentId: entity.id,
		}

		const LineWidthArgs = {
			...sharedEntityFormArgs,
			...globalLineWidthArgs,
			defaultValue: { width },
		}

		const optionsBasis = Object.values(LineBasisTypeEnum).map(
			lineBasisEnum => ({
				[lineBasisEnum]: transformEntityEnumValueForSelect(lineBasisEnum),
			}),
		)

		const LineBasisArgs = {
			...sharedEntityFormArgs,
			...globalLineBasisArgs,
			options: optionsBasis,
			defaultValue: { basis },
		}

		const optionsStyle = Object.values(LineFormatTypeEnum).map(
			lineFormatEnum => ({
				[lineFormatEnum]: transformEntityEnumValueForSelect(lineFormatEnum),
			}),
		)

		const LineFormatArgs = {
			...sharedEntityFormArgs,
			...globalLineFormatArgs,
			options: optionsStyle,
			defaultValue: { format },
		}

		return [LineWidthArgs, LineBasisArgs, LineFormatArgs]
	}

	getPopoverTriggerColor({ entity }: { entity: IDesignWithLine }): undefined {
		return undefined
	}

	getPanelFormatIcon({
		entity,
	}: {
		entity: IDesignWithLine
	}): IDashboardPanelIcon {
		const { line } = entity
		const { format } = line

		const symbol = lineFormatIcon(format as lineFormatTypeEnum)
		return { symbol, text: `Line Format: ${format}` }
	}

	getPanelBasisIcon({
		entity,
	}: {
		entity: IDesignWithLine
	}): IDashboardPanelIcon | undefined {
		const { line } = entity
		const { format, basis } = line

		if (format === LineFormatTypeEnum.PIXEL) return undefined
		const icon = lineBasisIcon(basis as lineBasisTypeEnum) as IconName
		return {
			icon,
			text: `Line Basis: ${basis}`,
		}
	}
}
