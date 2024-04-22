import { EntityFormType } from '#app/schema/entity'
import {
	type defaultValueString,
	type defaultValueNumber,
} from '#app/schema/zod-helpers'
import {
	type IPanelEntityFormArgsOptionalMultiple,
	type IPanelEntityFormArgs,
	type IPanelEntityFormArgsMultiple,
} from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'
import { FormFetcherHex } from '../form/fetcher/hex'
import { FormFetcherNumber } from '../form/fetcher/number'
import { FormFetcherSelect } from '../form/fetcher/select'

export const PanelEntityForm = ({
	panelEntityForm,
	fromPopover,
}: {
	panelEntityForm: IPanelEntityFormArgsOptionalMultiple
	fromPopover?: boolean
}) => {
	switch (panelEntityForm.formType) {
		case EntityFormType.HEX:
			return (
				<PanelEntityFormHex
					panelEntityForm={panelEntityForm as IPanelEntityFormArgs}
					fromPopover={fromPopover}
				/>
			)
		case EntityFormType.NUMBER:
			return (
				<PanelEntityFormNumber
					panelEntityForm={panelEntityForm as IPanelEntityFormArgs}
					fromPopover={fromPopover}
				/>
			)
		case EntityFormType.SELECT:
			return (
				<PanelEntityFormSelect
					panelEntityForm={panelEntityForm as IPanelEntityFormArgs}
					fromPopover={fromPopover}
				/>
			)
		case EntityFormType.MULTIPLE:
			const panelEntityFormMultiple =
				panelEntityForm as IPanelEntityFormArgsMultiple
			// multiple is good for pairs like rows and columns next to each other
			return (
				<div className="flex">
					{panelEntityFormMultiple.forms.map((panelEntityForm, i) => (
						<PanelEntityForm
							key={i}
							panelEntityForm={panelEntityForm}
							fromPopover={fromPopover}
						/>
					))}
				</div>
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
		formId={`${panelEntityForm.formId}-${panelEntityForm.entityId}-${
			fromPopover ? '-popover' : ''
		}`}
		schema={panelEntityForm.schema}
		// label={panelEntityForm.label}
	/>
)

export const PanelEntityFormHex = ({
	panelEntityForm,
	fromPopover,
}: {
	panelEntityForm: IPanelEntityFormArgs
	fromPopover?: boolean
}) => (
	<FormFetcherHex
		entityId={panelEntityForm.entityId}
		defaultValue={panelEntityForm.defaultValue as defaultValueString}
		parentId={panelEntityForm.parentId}
		parentTypeId={panelEntityForm.parentTypeId}
		route={panelEntityForm.route}
		formId={`${panelEntityForm.formId}-${panelEntityForm.entityId}-${
			fromPopover ? '-popover' : ''
		}`}
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
	return (
		<FormFetcherSelect
			entityId={panelEntityForm.entityId}
			defaultValue={panelEntityForm.defaultValue}
			options={panelEntityForm.options || []}
			parentId={panelEntityForm.parentId}
			parentTypeId={panelEntityForm.parentTypeId}
			route={panelEntityForm.route}
			formId={`${panelEntityForm.formId}-${panelEntityForm.entityId}-${
				fromPopover ? '-popover' : ''
			}`}
			schema={panelEntityForm.schema}
			// label={panelEntityForm.label}
		/>
	)
}
