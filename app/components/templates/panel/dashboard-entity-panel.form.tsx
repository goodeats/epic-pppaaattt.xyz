import { EntityFormType } from '#app/schema/entity'
import { type defaultValueNumber } from '#app/schema/zod-helpers'
import { type IPanelEntityFormArgs } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'
import { FormFetcherNumber } from '../form/fetcher/number'
import { FormFetcherSelect } from '../form/fetcher/select'

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
		case EntityFormType.SELECT:
			console.log('here', panelEntityForm)
			return (
				<PanelEntityFormSelect
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

export const PanelEntityFormSelect = ({
	panelEntityForm,
	fromPopover,
}: {
	panelEntityForm: IPanelEntityFormArgs
	fromPopover?: boolean
}) => {
	console.log('panelEntityForm', panelEntityForm)
	return (
		<FormFetcherSelect
			entityId={panelEntityForm.entityId}
			defaultValue={panelEntityForm.defaultValue}
			options={panelEntityForm.options || []}
			parentId={panelEntityForm.parentId}
			parentTypeId={panelEntityForm.parentTypeId}
			route={panelEntityForm.route}
			formId={`${panelEntityForm.formId}${fromPopover && '-popover'}`}
			schema={panelEntityForm.schema}
			// label={panelEntityForm.label}
		/>
	)
}
