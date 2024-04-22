import {
	SidebarPanelPopoverFormContainer,
	SidebarPanelPopoverFormsContainer,
	SidebarPanelPopoverHeader,
} from '#app/components/layout/popover'
import { type IDesignWithType } from '#app/models/design.server'
import { type IDashboardPanelUpdateEntityValuesStrategy } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'
import {
	SidebarPanelPopover,
	SidebarPanelPopoverContent,
	SidebarPanelPopoverTrigger,
} from '..'
import { PanelEntityForm } from './dashboard-entity-panel.form'

type PanelEntity = IDesignWithType

export const PanelEntityPopover = ({
	name,
	entity,
	backgroundColor,
	strategyEntityValues,
}: {
	name: string
	entity: PanelEntity
	backgroundColor?: string
	strategyEntityValues: IDashboardPanelUpdateEntityValuesStrategy
}) => {
	const panelEntityPopoverForms = strategyEntityValues.getPopoverForms({
		entity,
	})

	return (
		<SidebarPanelPopover>
			<SidebarPanelPopoverTrigger
				iconText={`${name} settings`}
				backgroundColor={backgroundColor}
			/>
			<SidebarPanelPopoverContent>
				<SidebarPanelPopoverHeader name={name} />
				<SidebarPanelPopoverFormsContainer>
					{panelEntityPopoverForms.map((form, index) => {
						return (
							<SidebarPanelPopoverFormContainer key={index}>
								{/* TODO: fix labels */}
								{/* {form.label && <Label htmlFor={form.label}>{form.label}</Label>} */}
								{form.label && <span>{form.label}</span>}
								<PanelEntityForm panelEntityForm={form} fromPopover={true} />
							</SidebarPanelPopoverFormContainer>
						)
					})}
				</SidebarPanelPopoverFormsContainer>
			</SidebarPanelPopoverContent>
		</SidebarPanelPopover>
	)
}
