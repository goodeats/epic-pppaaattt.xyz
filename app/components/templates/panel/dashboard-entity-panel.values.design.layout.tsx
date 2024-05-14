import { type IEntity } from '#app/schema/entity'
import { SidebarPanelRowValuesContainer } from '..'

export const PanelEntityValuesDesignLayout = ({
	entity,
}: {
	entity: IEntity
}) => {
	return (
		<SidebarPanelRowValuesContainer>
			Layout
			{/* <PanelEntityPopover
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
				)} */}
		</SidebarPanelRowValuesContainer>
	)
}
