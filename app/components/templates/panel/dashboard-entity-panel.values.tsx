import { type IDesignWithType } from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { type IDashboardPanelUpdateEntityValuesStrategy } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'
import { SidebarPanelRowValuesContainer } from '..'
import { PanelEntityForm } from './dashboard-entity-panel.form'
import { PanelEntityPopover } from './dashboard-entity-panel.popover'

type PanelEntity = IDesignWithType
type PanelEntityType = designTypeEnum

export const PanelEntityValues = ({
	type,
	entity,
	strategyEntityValues,
}: {
	type: PanelEntityType
	entity: PanelEntity
	strategyEntityValues: IDashboardPanelUpdateEntityValuesStrategy
}) => {
	const panelEntityMainForm = strategyEntityValues.getMainPanelForm({
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
			{/*
			{layout.style === 'random' ? (
				<PanelFormDesignLayoutEditCount layout={layout} />
			) : (
				<SidebarPanelRowValuesDisabled
					value={`${layout.rows} x ${layout.columns}`}
				/>
			)} */}
		</SidebarPanelRowValuesContainer>
	)
}
