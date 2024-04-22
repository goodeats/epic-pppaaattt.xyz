import { type IEntity, type IEntityType } from '#app/schema/entity'
import { type IDashboardPanelUpdateEntityValuesStrategy } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'
import { SidebarPanelRowValuesContainer } from '..'
import { PanelEntityForm } from './dashboard-entity-panel.form'
import { PanelEntityIcon } from './dashboard-entity-panel.icons'
import { PanelEntityPopover } from './dashboard-entity-panel.popover'

export const PanelEntityValues = ({
	type,
	entity,
	strategyEntityValues,
}: {
	type: IEntityType
	entity: IEntity
	strategyEntityValues: IDashboardPanelUpdateEntityValuesStrategy
}) => {
	const panelEntityMainForm = strategyEntityValues.getMainPanelForm({
		entity,
	})
	const panelEntityFormatIcon = strategyEntityValues.getPanelFormatIcon({
		entity,
	})
	const panelEntityBasisIcon = strategyEntityValues.getPanelBasisIcon({
		entity,
	})

	return (
		<SidebarPanelRowValuesContainer>
			<PanelEntityPopover
				name={type}
				entity={entity}
				strategyEntityValues={strategyEntityValues}
			/>
			<PanelEntityForm panelEntityForm={panelEntityMainForm} />
			{panelEntityFormatIcon && (
				<PanelEntityIcon panelEntityIcon={panelEntityFormatIcon} />
			)}
			{panelEntityBasisIcon && (
				<PanelEntityIcon panelEntityIcon={panelEntityBasisIcon} />
			)}
		</SidebarPanelRowValuesContainer>
	)
}
