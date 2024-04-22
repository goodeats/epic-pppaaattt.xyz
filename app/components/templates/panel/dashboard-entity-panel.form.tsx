import { type defaultValueNumber } from '#app/schema/zod-helpers'
import { type IPanelEntityFormArgs } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'
import { FormFetcherNumber } from '../form/fetcher/number'

export const PanelEntityForm = ({
	panelEntityForm,
}: {
	panelEntityForm: IPanelEntityFormArgs
}) => {
	switch (panelEntityForm.formType) {
		case 'hex':
			return null
		// <FormFetcherHex
		// />
		case 'number':
			return <PanelEntityFormNumber panelEntityForm={panelEntityForm} />
		case 'string':
			return null
		// <FormFetcherString
		// />
		default:
			return null
	}
}

export const PanelEntityFormNumber = ({
	panelEntityForm,
}: {
	panelEntityForm: IPanelEntityFormArgs
}) => (
	<FormFetcherNumber
		entityId={panelEntityForm.entityId}
		defaultValue={panelEntityForm.defaultValue as defaultValueNumber}
		parentId={panelEntityForm.parentId}
		parentTypeId={panelEntityForm.parentTypeId}
		route={panelEntityForm.route}
		formId={panelEntityForm.formId}
		schema={panelEntityForm.schema}
	/>
)
