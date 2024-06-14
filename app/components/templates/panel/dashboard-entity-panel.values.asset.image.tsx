import { memo, useCallback } from 'react'
import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { type IAssetType } from '#app/models/asset/asset.server'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { AssetUpdateName } from '#app/routes/resources+/api.v1+/asset.update.name'
import { SidebarPanelRowValuesContainer } from '..'
import { PanelEntityPopover } from './dashboard-entity-panel.popover'

interface EntityProps {
	entity: IAssetType
}

const EntityPopover = memo(({ entity }: EntityProps) => {
	// display color on popover trigger if fill is defined and solid
	// const { fill } = entity as IDesignWithFill
	// const { basis, value } = fill
	// const displayColor =
	// 	basis === FillBasisTypeEnum.DEFINED && FillStyleTypeEnum.SOLID
	// const backgroundColor = displayColor ? value : undefined

	return (
		<PanelEntityPopover name="Image">
			<SidebarPanelPopoverFormContainer>
				<span>Name</span>
				<AssetUpdateName asset={entity} formLocation="popover" />
			</SidebarPanelPopoverFormContainer>
		</PanelEntityPopover>
	)
})
EntityPopover.displayName = 'EntityPopover'

const EntityMainForm = memo(({ entity }: EntityProps) => {
	return <AssetUpdateName asset={entity} />
})
EntityMainForm.displayName = 'EntityMainForm'

export const PanelEntityValuesAssetImage = ({
	entity,
}: {
	entity: IAssetImage
}) => {
	const entityPopover = useCallback(
		() => <EntityPopover entity={entity} />,
		[entity],
	)

	const entityMainForm = useCallback(
		() => <EntityMainForm entity={entity} />,
		[entity],
	)

	return (
		<SidebarPanelRowValuesContainer>
			{entityPopover()}
			{entityMainForm()}
		</SidebarPanelRowValuesContainer>
	)
}
