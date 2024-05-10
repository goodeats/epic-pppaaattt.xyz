import { EntityFormType } from '#app/schema/entity'
import {
	type IPanelEntityFormArgsOptionalMultiple,
	type IPanelEntityFormArgs,
	type IPanelEntityFormArgsMultiple,
} from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'
import { FormFetcherButton } from '../form/fetcher/button'
import { FormFetcherHex } from '../form/fetcher/hex'
import { FormFetcherNumber } from '../form/fetcher/number'
import { FormFetcherSelect } from '../form/fetcher/select'
import { FormFetcherText } from '../form/fetcher/text'
import { FormFetcherTextarea } from '../form/fetcher/textarea'

export const PanelEntityForm = ({
	panelEntityForm,
	fromPopover,
}: {
	panelEntityForm: IPanelEntityFormArgsOptionalMultiple
	fromPopover?: boolean
}) => {
	// map component to form type
	const FormComponent =
		formTypeComponents[
			panelEntityForm.formType as keyof typeof formTypeComponents
		]

	// if no component, return null
	if (!FormComponent) return null

	// if multiple forms, render each form in div
	if (panelEntityForm.formType === EntityFormType.MULTIPLE) {
		const panelEntityFormMultiple =
			panelEntityForm as IPanelEntityFormArgsMultiple
		return (
			<div className="flex">
				{panelEntityFormMultiple.forms.map((form, index) => (
					<PanelEntityForm
						key={index}
						panelEntityForm={form}
						fromPopover={fromPopover}
					/>
				))}
			</div>
		)
	}

	return (
		<FormComponent
			panelEntityForm={panelEntityForm as IPanelEntityFormArgs}
			fromPopover={fromPopover}
		/>
	)
}

// Define a common interface for the props used by all fetcher components
interface IFormFetcherProps {
	panelEntityForm: IPanelEntityFormArgs
	fromPopover?: boolean
}

// Factory function to generate form components
const createFormComponent = (FetcherComponent: React.ComponentType<any>) => {
	const Component = ({ panelEntityForm, fromPopover }: IFormFetcherProps) => (
		<FetcherComponent
			entityId={panelEntityForm.entityId}
			defaultValue={panelEntityForm.defaultValue}
			options={panelEntityForm.options || []}
			parentId={panelEntityForm.parentId}
			parentTypeId={panelEntityForm.parentTypeId}
			route={panelEntityForm.route}
			formId={`${panelEntityForm.formId}-${panelEntityForm.entityId}${
				fromPopover ? '-popover' : ''
			}`}
			schema={panelEntityForm.schema}
			icon={panelEntityForm.icon}
			buttonText={panelEntityForm.buttonText}
			buttonVariant={panelEntityForm.buttonVariant}
		/>
	)
	Component.displayName = `FormComponent(${
		FetcherComponent.displayName || FetcherComponent.name
	})`
	return Component
}

// Specific form components created using the factory function
export const PanelEntityFormNumber = createFormComponent(
	FormFetcherNumber as React.ComponentType<any>,
)
export const PanelEntityFormHex = createFormComponent(
	FormFetcherHex as React.ComponentType<any>,
)
export const PanelEntityFormText = createFormComponent(
	FormFetcherText as React.ComponentType<any>,
)
export const PanelEntityFormTextarea = createFormComponent(
	FormFetcherTextarea as React.ComponentType<any>,
)
export const PanelEntityFormSelect = createFormComponent(
	FormFetcherSelect as React.ComponentType<any>,
)
export const PanelEntityFormButton = createFormComponent(
	FormFetcherButton as React.ComponentType<any>,
)

// Map form types to form components
const formTypeComponents = {
	[EntityFormType.HEX]: PanelEntityFormHex,
	[EntityFormType.NUMBER]: PanelEntityFormNumber,
	[EntityFormType.TEXT]: PanelEntityFormText,
	[EntityFormType.TEXTAREA]: PanelEntityFormTextarea,
	[EntityFormType.SELECT]: PanelEntityFormSelect,
	[EntityFormType.BUTTON]: PanelEntityFormButton,
}
