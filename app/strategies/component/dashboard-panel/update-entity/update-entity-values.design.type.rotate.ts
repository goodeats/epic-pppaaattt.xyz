import { type IDesignWithRotate } from '#app/models/design/design.server'
import { EntityFormType, EntityParentIdType } from '#app/schema/entity'
import {
	EditDesignRotateBasisSchema,
	EditDesignRotateValueSchema,
	RotateBasisTypeEnum,
} from '#app/schema/rotate'
import { Routes } from '#app/utils/routes.const'
import { transformEntityEnumValueForSelect } from '#app/utils/string-formatting'
import {
	type IPanelEntityFormArgsOptionalMultiple,
	type IDashboardPanelUpdateEntityValuesStrategy,
	type IPanelEntityFormArgs,
	type IDashboardPanelIcon,
} from './update-entity-values'

// const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.ROTATE.UPDATE
// const globalEntityFormArgs = {
// 	parentTypeId: EntityParentIdType.DESIGN_ID,
// }
// const globalRotateValueArgs = {
// 	route: baseRoute.VALUE,
// 	formType: EntityFormType.HEX,
// 	formId: 'design-type-update-rotate-count',
// 	schema: EditDesignRotateValueSchema,
// 	label: 'Value',
// }
// const globalRotateBasisArgs = {
// 	route: baseRoute.BASIS,
// 	formType: EntityFormType.SELECT,
// 	formId: 'design-type-update-rotate-basis',
// 	schema: EditDesignRotateBasisSchema,
// 	label: 'Basis',
// }

export class DashboardPanelUpdateDesignTypeRotateValuesStrategy
	implements IDashboardPanelUpdateEntityValuesStrategy
{
	getMainPanelForm({
		entity,
	}: {
		entity: IDesignWithRotate
	}): IPanelEntityFormArgsOptionalMultiple {
		const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.ROTATE.UPDATE
		const globalEntityFormArgs = {
			parentTypeId: EntityParentIdType.DESIGN_ID,
		}
		const globalRotateValueArgs = {
			route: baseRoute.VALUE,
			formType: EntityFormType.HEX,
			formId: 'design-type-update-rotate-count',
			schema: EditDesignRotateValueSchema,
			label: 'Value',
		}
		const globalRotateBasisArgs = {
			route: baseRoute.BASIS,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-rotate-basis',
			schema: EditDesignRotateBasisSchema,
			label: 'Basis',
		}

		const { rotate } = entity
		const { value, basis } = rotate

		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: rotate.id,
			parentId: entity.id,
		}

		if (basis !== RotateBasisTypeEnum.DEFINED) {
			const optionsBasis = Object.values(RotateBasisTypeEnum).map(
				rotateBasisEnum => ({
					[rotateBasisEnum]: transformEntityEnumValueForSelect(rotateBasisEnum),
				}),
			)

			const RotateBasisArgs = {
				...sharedEntityFormArgs,
				...globalRotateBasisArgs,
				options: optionsBasis,
				defaultValue: { basis },
			}
			return RotateBasisArgs
		}

		const RotateValueArgs = {
			...sharedEntityFormArgs,
			...globalRotateValueArgs,
			defaultValue: { value },
		}
		return RotateValueArgs
	}

	getPopoverForms({
		entity,
	}: {
		entity: IDesignWithRotate
	}): IPanelEntityFormArgs[] {
		const baseRoute = Routes.RESOURCES.API.V1.DESIGN.TYPE.ROTATE.UPDATE
		const globalEntityFormArgs = {
			parentTypeId: EntityParentIdType.DESIGN_ID,
		}
		const globalRotateValueArgs = {
			route: baseRoute.VALUE,
			formType: EntityFormType.HEX,
			formId: 'design-type-update-rotate-count',
			schema: EditDesignRotateValueSchema,
			label: 'Value',
		}
		const globalRotateBasisArgs = {
			route: baseRoute.BASIS,
			formType: EntityFormType.SELECT,
			formId: 'design-type-update-rotate-basis',
			schema: EditDesignRotateBasisSchema,
			label: 'Basis',
		}

		const { rotate } = entity
		const { value, basis } = rotate
		const sharedEntityFormArgs = {
			...globalEntityFormArgs,
			entityId: rotate.id,
			parentId: entity.id,
		}

		const RotateValueArgs = {
			...sharedEntityFormArgs,
			...globalRotateValueArgs,
			defaultValue: { value },
		}

		const optionsBasis = Object.values(RotateBasisTypeEnum).map(
			rotateBasisEnum => ({
				[rotateBasisEnum]: transformEntityEnumValueForSelect(rotateBasisEnum),
			}),
		)

		const RotateBasisArgs = {
			...sharedEntityFormArgs,
			...globalRotateBasisArgs,
			options: optionsBasis,
			defaultValue: { basis },
		}

		return [RotateValueArgs, RotateBasisArgs]
	}

	getPopoverTriggerColor({ entity }: { entity: IDesignWithRotate }): undefined {
		return undefined
	}

	getPanelFormatIcon({ entity }: { entity: IDesignWithRotate }): undefined {
		return undefined
	}

	getPanelBasisIcon({
		entity,
	}: {
		entity: IDesignWithRotate
	}): IDashboardPanelIcon | undefined {
		const { rotate } = entity
		const { basis } = rotate

		if (basis !== RotateBasisTypeEnum.DEFINED) return undefined

		return {
			symbol: '°',
			text: `Rotate Basis: ${basis}`,
		}
	}
}
