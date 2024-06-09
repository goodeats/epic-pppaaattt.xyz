import { useMatches } from '@remix-run/react'
import { memo, useCallback } from 'react'
import { ImagePreview } from '#app/components/image'
import {
	FlexRow,
	ImageSidebar,
	ImageSidebarList,
	ImageSidebarListItem,
} from '#app/components/layout'
import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRowActionsContainer,
} from '#app/components/templates'
import {
	type IArtwork,
	type IArtworkWithImages,
} from '#app/models/artwork/artwork.server'
import { type IArtworkImage } from '#app/models/images/artwork-image.server'
import { ArtworkImageCreate } from '#app/routes/resources+/api.v1+/artwork.image.create'
import { ArtworkImageDelete } from '#app/routes/resources+/api.v1+/artwork.image.delete'
import { ArtworkImageUpdate } from '#app/routes/resources+/api.v1+/artwork.image.update'
import { useRouteLoaderMatchData } from '#app/utils/matches'
import { getArtworkImgSrc } from '#app/utils/misc'
import { artworkVersionLoaderRoute } from '../$branchSlug.$versionSlug'

const ImageCreate = memo(({ artwork }: { artwork: IArtworkWithImages }) => {
	return <ArtworkImageCreate artwork={artwork} />
})
ImageCreate.displayName = 'ImageCreate'

const ImageUpdate = memo(({ image }: { image: IArtworkImage }) => {
	return <ArtworkImageUpdate image={image} />
})
ImageUpdate.displayName = 'ImageUpdate'

const ImageDelete = memo(
	({ image, artwork }: { image: IArtworkImage; artwork: IArtwork }) => {
		return <ArtworkImageDelete image={image} artwork={artwork} />
	},
)
ImageDelete.displayName = 'ImageDelete'

const ImageListItem = memo(
	({ image, artwork }: { image: IArtworkImage; artwork: IArtwork }) => {
		return (
			<ImageSidebarListItem key={image.id}>
				<FlexRow className="items-center">
					<div className="flex-1 truncate">{image.name}</div>
					<ImageUpdate image={image} />
					<ImageDelete image={image} artwork={artwork} />
				</FlexRow>
				<ImagePreview
					src={getArtworkImgSrc(image.id)}
					alt={image.altText ?? ''}
				/>
			</ImageSidebarListItem>
		)
	},
)
ImageListItem.displayName = 'ImageListItem'

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
						<ImageListItem key={image.id} image={image} artwork={artwork} />
					))}
				</ImageSidebarList>
			</ImageSidebar>
		</div>
	)
}
