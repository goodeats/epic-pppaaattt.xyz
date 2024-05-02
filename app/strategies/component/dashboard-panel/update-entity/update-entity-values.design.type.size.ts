import { type IconName } from '#app/components/ui/icon'
import { type IDesignWithSize } from '#app/models/design.server'
import { EntityFormType, EntityParentIdType } from '#app/schema/entity'
import {
	EditDesignSizeBasisSchema,
	EditDesignSizeFormatSchema,
	EditDesignSizeValueSchema,
	SizeBasisTypeEnum,
	SizeFormatTypeEnum,
	sizeBasisIcon,
	type sizeFormatTypeEnum,
	type sizeBasisTypeEnum,
	sizeFormatIcon,
} from '#app/schema/size'
import { Routes } from '#app/utils/routes.utils'
import { transformEntityEnumValueForSelect } from '#app/utils/string-formatting'
import {
	type IPanelEntityFormArgsOptionalMultiple,
	type IDashboardPanelUpdateEntityValuesStrategy,
	type IPanelEntityFormArgs,
	type IDashboardPanelIcon,
} from './update-entity-values'

// const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE
// const globalEntityFormArgs = {
// 	parentTypeId: EntityParentIdType.DESIGN_ID,
// }
// const globalSizeValueArgs = {
// 	route: baseRoute.VALUE,
// 	formType: EntityFormType.NUMBER,
// 	formId: 'design-type-update-size-count',
// 	schema: EditDesignSizeValueSchema,
// 	label: 'Value',
// }
// const globalSizeBasisArgs = {
// 	route: baseRoute.BASIS,
// 	formType: EntityFormType.SELECT,
// 	formId: 'design-type-update-size-basis',
// 	schema: EditDesignSizeBasisSchema,
// 	label: 'Basis',
// }
// const globalSizeFormatArgs = {
// 	route: baseRoute.FORMAT,
// 	formType: EntityFormType.SELECT,
// 	formId: 'design-type-update-size-format',
// 	schema: EditDesignSizeFormatSchema,
// 	label: 'Format',
// }

export class DashboardPanelUpdateDesignTypeSizeValuesStrategy
	implements IDashboardPanelUpdateEntityValuesStrategy
{
	getMainPanelForm({
		entity,
	}: {
		entity: IDesignWithSize
	}): IPanelEntityFormArgsOptionalMultiple {
		const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE
		const globalEntityFormArgs = {
			parentTypeId: EntityParentIdType.DESIGN_ID,
		}
		const globalSizeValueArgs = {
			route: baseRoute.VALUE,
			formType: EntityFormType.NUMBER,
			formId: 'design-type-update-size-count',
			schema: EditDesignSizeValueSchema,
			label: 'Value',
		}

		const { size } = entity
		const { value } = size

		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: size.id,
			parentId: entity.id,
		}

		const sizeValueArgs = {
			...sharedEntityFormArgs,
			...globalSizeValueArgs,
			defaultValue: { value },
		}

		return sizeValueArgs
	}

	getPopoverForms({
		entity,
	}: {
		entity: IDesignWithSize
	}): IPanelEntityFormArgs[] {
		const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE
		const globalEntityFormArgs = {
			parentTypeId: EntityParentIdType.DESIGN_ID,
		}
		const globalSizeValueArgs = {
			route: baseRoute.VALUE,
			formType: EntityFormType.NUMBER,
			formId: 'design-type-update-size-count',
			schema: EditDesignSizeValueSchema,
			label: 'Value',
		}
		const globalSizeBasisArgs = {
			route: baseRoute.BASIS,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-size-basis',
			schema: EditDesignSizeBasisSchema,
			label: 'Basis',
		}
		const globalSizeFormatArgs = {
			route: baseRoute.FORMAT,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-size-format',
			schema: EditDesignSizeFormatSchema,
			label: 'Format',
		}

		const { size } = entity
		const { value, basis, format } = size
		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: size.id,
			parentId: entity.id,
		}

		const sizeValueArgs = {
			...sharedEntityFormArgs,
			...globalSizeValueArgs,
			defaultValue: { value },
		}

		const optionsBasis = Object.values(SizeBasisTypeEnum).map(
			sizeBasisEnum => ({
				[sizeBasisEnum]: transformEntityEnumValueForSelect(sizeBasisEnum),
			}),
		)

		const sizeBasisArgs = {
			...sharedEntityFormArgs,
			...globalSizeBasisArgs,
			options: optionsBasis,
			defaultValue: { basis },
		}

		const optionsFormat = Object.values(SizeFormatTypeEnum).map(
			sizeFormatEnum => ({
				[sizeFormatEnum]: transformEntityEnumValueForSelect(sizeFormatEnum),
			}),
		)

		const sizeFormatArgs = {
			...sharedEntityFormArgs,
			...globalSizeFormatArgs,
			options: optionsFormat,
			defaultValue: { format },
		}

		return [sizeValueArgs, sizeBasisArgs, sizeFormatArgs]
	}

	getPopoverTriggerColor({ entity }: { entity: IDesignWithSize }): undefined {
		return undefined
	}

	getPanelFormatIcon({
		entity,
	}: {
		entity: IDesignWithSize
	}): IDashboardPanelIcon {
		const { size } = entity
		const { format } = size

		const symbol = sizeFormatIcon(format as sizeFormatTypeEnum)
		return { symbol, text: `Size Format: ${format}` }
	}

	getPanelBasisIcon({
		entity,
	}: {
		entity: IDesignWithSize
	}): IDashboardPanelIcon | undefined {
		const { size } = entity
		const { format, basis } = size

		if (format === SizeFormatTypeEnum.PIXEL) return undefined
		const icon = sizeBasisIcon(basis as sizeBasisTypeEnum) as IconName
		return {
			icon,
			text: `Size Basis: ${basis}`,
		}
	}
}
