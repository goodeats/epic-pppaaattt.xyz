import { DesignTypeEnum } from '#app/schema/design'
import { type IEntity, type IEntityType } from '#app/schema/entity'
import { type IDashboardPanelUpdateEntityValuesStrategy } from '#app/strategies/component/dashboard-panel/update-entity/update-entity-values'
import { PanelEntityValuesDesignFill } from './dashboard-entity-panel.values.design.fill'
import { PanelEntityValuesDesignLayout } from './dashboard-entity-panel.values.design.layout'
import { PanelEntityValuesDesignLine } from './dashboard-entity-panel.values.design.line'
import { PanelEntityValuesDesignPalette } from './dashboard-entity-panel.values.design.palette'
import { PanelEntityValuesDesignRotate } from './dashboard-entity-panel.values.design.rotate'
import { PanelEntityValuesDesignSize } from './dashboard-entity-panel.values.design.size'
import { PanelEntityValuesDesignStroke } from './dashboard-entity-panel.values.design.stroke'
import { PanelEntityValuesDesignTemplate } from './dashboard-entity-panel.values.design.template'
import { PanelEntityValuesLayer } from './dashboard-entity-panel.values.layer'

export const PanelEntityValues = ({
	type,
	entity,
	strategyEntityValues,
}: {
	type: IEntityType
	entity: IEntity
	strategyEntityValues: IDashboardPanelUpdateEntityValuesStrategy
}) => {
	// const panelEntityMainForm = strategyEntityValues.getMainPanelForm({
	// 	entity,
	// })
	// const panelEntityFormatIcon = strategyEntityValues.getPanelFormatIcon({
	// 	entity,
	// })
	// const panelEntityBasisIcon = strategyEntityValues.getPanelBasisIcon({
	// 	entity,
	// })

	if (type === 'layer') {
		return <PanelEntityValuesLayer entity={entity} />
		// return (
		// 	<SidebarPanelRowValuesContainer>
		// 		<PanelEntityPopover
		// 			name={type}
		// 			entity={entity}
		// 			strategyEntityValues={strategyEntityValues}
		// 		/>
		// 		<PanelEntityForm panelEntityForm={panelEntityMainForm} />
		// 		{panelEntityFormatIcon && (
		// 			<PanelEntityIcon panelEntityIcon={panelEntityFormatIcon} />
		// 		)}
		// 		{panelEntityBasisIcon && (
		// 			<PanelEntityIcon panelEntityIcon={panelEntityBasisIcon} />
		// 		)}
		// 	</SidebarPanelRowValuesContainer>
		// )
	}

	switch (type) {
		case DesignTypeEnum.FILL:
			return <PanelEntityValuesDesignFill entity={entity} />
		case DesignTypeEnum.LAYOUT:
			return <PanelEntityValuesDesignLayout entity={entity} />
		case DesignTypeEnum.LINE:
			return <PanelEntityValuesDesignLine entity={entity} />
		case DesignTypeEnum.PALETTE:
			return <PanelEntityValuesDesignPalette entity={entity} />
		case DesignTypeEnum.SIZE:
			return <PanelEntityValuesDesignSize entity={entity} />
		case DesignTypeEnum.STROKE:
			return <PanelEntityValuesDesignStroke entity={entity} />
		case DesignTypeEnum.ROTATE:
			return <PanelEntityValuesDesignRotate entity={entity} />
		case DesignTypeEnum.TEMPLATE:
			return <PanelEntityValuesDesignTemplate entity={entity} />
		default:
			return 'Default'
	}
}
