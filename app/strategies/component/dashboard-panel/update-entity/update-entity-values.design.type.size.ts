import { type IDesignWithSize } from '#app/models/design.server'
import { EntityFormType, EntityParentIdType } from '#app/schema/entity'
import {
	EditDesignSizeBasisSchema,
	EditDesignSizeFormatSchema,
	EditDesignSizeValueSchema,
	SizeBasisTypeEnum,
	SizeFormatTypeEnum,
} from '#app/schema/size'
import { Routes } from '#app/utils/routes.utils'
import { transformEntityEnumValueForSelect } from '#app/utils/string-formatting'
import {
	type IPanelEntityFormArgsOptionalMultiple,
	type IDashboardPanelUpdateEntityValuesStrategy,
	type IPanelEntityFormArgs,
} from './update-entity-values'

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
	label: 'Columns',
}

export class DashboardPanelUpdateDesignTypeSizeValuesStrategy
	implements IDashboardPanelUpdateEntityValuesStrategy
{
	getMainPanelForm({
		entity,
	}: {
		entity: IDesignWithSize
	}): IPanelEntityFormArgsOptionalMultiple {
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

		// const sizeBasisArgs = {
		// 	...sharedEntityFormArgs,
		// 	...globalSizeBasisArgs,
		// 	defaultValue: { rows: size.rows },
		// }

		// const sizeFormatArgs = {
		// 	...sharedEntityFormArgs,
		// 	...globalSizeFormatArgs,
		// 	defaultValue: { columns: size.columns },
		// }

		// if (style === 'random') {
		// 	return sizeValueArgs
		// } else {
		// 	return {
		// 		formType: EntityFormType.MULTIPLE,
		// 		forms: [sizeBasisArgs, sizeFormatArgs],
		// 	}
		// }
		return sizeValueArgs
	}

	getPopoverForms({
		entity,
	}: {
		entity: IDesignWithSize
	}): IPanelEntityFormArgs[] {
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

	getPopoverTriggerColor({
		entity,
	}: {
		entity: IDesignWithSize
	}): string | undefined {
		return undefined
	}
}
