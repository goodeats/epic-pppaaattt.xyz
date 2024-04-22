import { EntityFormType } from '#app/schema/entity'
import { type defaultValueNumber } from '#app/schema/zod-helpers'
import { type IPanelEntityFormArgs } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'
import { FormFetcherNumber } from '../form/fetcher/number'

export const PanelEntityForm = ({
	panelEntityForm,
	fromPopover,
}: {
	panelEntityForm: IPanelEntityFormArgs
	fromPopover?: boolean
}) => {
	switch (panelEntityForm.formType) {
		case EntityFormType.HEX:
			return null
		// <FormFetcherHex
		// />
		case EntityFormType.NUMBER:
			return (
				<PanelEntityFormNumber
					panelEntityForm={panelEntityForm}
					fromPopover={fromPopover}
				/>
			)
		default:
			return null
	}
}

export const PanelEntityFormNumber = ({
	panelEntityForm,
	fromPopover,
}: {
	panelEntityForm: IPanelEntityFormArgs
	fromPopover?: boolean
}) => (
	<FormFetcherNumber
		entityId={panelEntityForm.entityId}
		defaultValue={panelEntityForm.defaultValue as defaultValueNumber}
		parentId={panelEntityForm.parentId}
		parentTypeId={panelEntityForm.parentTypeId}
		route={panelEntityForm.route}
		formId={`${panelEntityForm.formId}${fromPopover && '-popover'}`}
		schema={panelEntityForm.schema}
		// label={panelEntityForm.label}
	/>
)
