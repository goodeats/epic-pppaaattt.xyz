import { memo, useCallback } from 'react'
import { ImagePreview } from '#app/components/image'
import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { getAssetImgSrc } from '#app/models/asset/image/utils'
import { AssetImageUpdateFit } from '#app/routes/resources+/api.v1+/asset.image.update.fit'
import { AssetUpdateName } from '#app/routes/resources+/api.v1+/asset.update.name'
import { SidebarPanelRowValuesContainer } from '..'
import { PanelEntityPopover } from './dashboard-entity-panel.popover'

interface EntityProps {
	image: IAssetImage
}

const EntityPopover = memo(({ image }: EntityProps) => {
	const { attributes } = image
	const { altText } = attributes
	const imgSrc = getAssetImgSrc({ image })

	return (
		<PanelEntityPopover name="Image">
			<SidebarPanelPopoverFormContainer>
				<span>Image</span>
				<ImagePreview src={imgSrc} alt={altText ?? ''} />
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Name</span>
				<AssetUpdateName asset={image} formLocation="popover" />
			</SidebarPanelPopoverFormContainer>
			<SidebarPanelPopoverFormContainer>
				<span>Fit</span>
				<AssetImageUpdateFit image={image} formLocation="popover" />
			</SidebarPanelPopoverFormContainer>
		</PanelEntityPopover>
	)
})
EntityPopover.displayName = 'EntityPopover'

const EntityMainForm = memo(({ image }: EntityProps) => {
	return <AssetUpdateName asset={image} />
})
EntityMainForm.displayName = 'EntityMainForm'

export const PanelEntityValuesAssetImage = ({
	entity,
}: {
	entity: IAssetImage
}) => {
	const entityPopover = useCallback(
		() => <EntityPopover image={entity} />,
		[entity],
	)

	const entityMainForm = useCallback(
		() => <EntityMainForm image={entity} />,
		[entity],
	)

	return (
		<SidebarPanelRowValuesContainer>
			{entityPopover()}
			{entityMainForm()}
		</SidebarPanelRowValuesContainer>
	)
}
