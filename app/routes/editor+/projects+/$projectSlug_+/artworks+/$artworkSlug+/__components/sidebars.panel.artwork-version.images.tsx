import { useMatches } from '@remix-run/react'
import { memo, useCallback } from 'react'
import { ImagePreview } from '#app/components/image'
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
import { type IArtworkWithImages } from '#app/models/artwork/artwork.server'
import { ArtworkImageCreate } from '#app/routes/resources+/api.v1+/artwork.image.create'
import { useRouteLoaderMatchData } from '#app/utils/matches'
import { getArtworkImgSrc } from '#app/utils/misc'
import { artworkVersionLoaderRoute } from '../$branchSlug.$versionSlug'

const ImageCreate = memo(({ artwork }: { artwork: IArtworkWithImages }) => {
	return <ArtworkImageCreate artwork={artwork} />
})
ImageCreate.displayName = 'ImageCreate'

export const PanelArtworkVersionImages = ({}: {}) => {
	const matches = useMatches()
	const { artwork } = useRouteLoaderMatchData(
		matches,
		artworkVersionLoaderRoute,
	)

	const artworkImageCreate = useCallback(
		() => <ImageCreate artwork={artwork} />,
		[artwork],
	)

	return (
		<div>
			<SidebarPanel>
				<SidebarPanelHeader title="Images">
					<SidebarPanelRowActionsContainer>
						{artworkImageCreate()}
					</SidebarPanelRowActionsContainer>
				</SidebarPanelHeader>
			</SidebarPanel>
			<ImageSidebar>
				<ImageSidebarList>
					{artwork.images.map(image => (
						<ImageSidebarListItem key={image.id}>
							<ImagePreview
								src={getArtworkImgSrc(image.id)}
								alt={image.altText ?? ''}
							/>
							<div>{image.name}</div>
						</ImageSidebarListItem>
					))}
				</ImageSidebarList>
			</ImageSidebar>
		</div>
	)
}
