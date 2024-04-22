import {
	SidebarPanelPopoverFormsContainer,
	SidebarPanelPopoverHeader,
} from '#app/components/layout/popover'
import { type IDesignWithType } from '#app/models/design.server'
import { type defaultValueNumber } from '#app/schema/zod-helpers'
import { type IDashboardPanelUpdateEntityValuesStrategy } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'
import {
	SidebarPanelPopover,
	SidebarPanelPopoverContent,
	SidebarPanelPopoverTrigger,
} from '..'
import { FormFetcherNumber } from '../form/fetcher/number'

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
							<FormFetcherNumber
								key={index}
								entityId={form.entityId}
								defaultValue={form.defaultValue as defaultValueNumber}
								parentId={form.parentId}
								parentTypeId={form.parentTypeId}
								route={form.route}
								formId={form.formId}
								schema={form.schema}
							/>
						)
					})}
				</SidebarPanelPopoverFormsContainer>
			</SidebarPanelPopoverContent>
		</SidebarPanelPopover>
	)
}
