import { type z } from 'zod'
import { type IconName } from '#app/components/ui/icon'
import {
	type entityParentIdTypeEnum,
	type entityFormTypeEnum,
	type IEntityId,
	type IEntityParentId,
	type IEntity,
	type IEntityEnumSelectOption,
} from '#app/schema/entity'
import { type defaultValueStringOrNumber } from '#app/schema/zod-helpers'
import { type RoutePath } from '#app/utils/routes.utils'

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

export interface IDashboardPanelIcon {
	icon?: IconName
	symbol?: string
	text: string
}
export interface IDashboardPanelUpdateEntityValuesStrategy {
	getMainPanelForm(args: {
		entity: IEntity
	}): IPanelEntityFormArgsOptionalMultiple
	getPopoverForms(args: { entity: IEntity }): IPanelEntityFormArgs[]
	getPopoverTriggerColor(args: { entity: IEntity }): string | undefined
	getPanelFormatIcon(args: { entity: IEntity }): IDashboardPanelIcon | undefined
	getPanelBasisIcon(args: { entity: IEntity }): IDashboardPanelIcon | undefined
}
