import { type IEntity } from '#app/schema/entity'
import { SidebarPanelRowValuesContainer } from '..'

export const PanelEntityValuesDesignSize = ({
	entity,
}: {
	entity: IEntity
}) => {
	return (
		<SidebarPanelRowValuesContainer>
			Size
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
