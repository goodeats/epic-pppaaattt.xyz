import { memo, useCallback } from 'react'
import {
	ImageSidebar,
	ImageSidebarList,
	ImageSidebarListItem,
} from '#app/components/layout'
import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRowActionsContainer,
} from '#app/components/templates'
import { type IArtworkWithAssets } from '#app/models/artwork/artwork.server'
import { useArtworkFromVersion } from '#app/models/artwork/hooks'
import { useAssetImagesArtwork } from '#app/models/asset/image/hooks'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { AssetImageArtworkCreate } from '#app/routes/resources+/api.v1+/asset.image.artwork.create'
import { ImageListItem } from './sidebars.panel.artwork-version.images.image'

const ImageCreate = memo(({ artwork }: { artwork: IArtworkWithAssets }) => {
	return <AssetImageArtworkCreate artwork={artwork} />
})
ImageCreate.displayName = 'ImageCreate'

export const PanelArtworkVersionImages = ({}: {}) => {
	const artwork = useArtworkFromVersion()
	const images = useAssetImagesArtwork()

	const imageCreate = useCallback(
		() => <ImageCreate artwork={artwork as IArtworkWithAssets} />,
		[artwork],
	)

	const renderImageListItem = useCallback(
		(image: IAssetImage) => (
			<ImageListItem
				key={image.id}
				image={image}
				artwork={artwork as IArtworkWithAssets}
			/>
		),
		[artwork],
	)

	return (
		<div>
			<SidebarPanel>
				<SidebarPanelHeader title="Images">
					<SidebarPanelRowActionsContainer>
						{imageCreate()}
					</SidebarPanelRowActionsContainer>
				</SidebarPanelHeader>
			</SidebarPanel>
			<ImageSidebar>
				<ImageSidebarList>
					{images.length === 0 && (
						<ImageSidebarListItem>
							<div className="text-sm text-muted-foreground">No images</div>
						</ImageSidebarListItem>
					)}
					{images.map(renderImageListItem)}
				</ImageSidebarList>
			</ImageSidebar>
		</div>
	)
}
