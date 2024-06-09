import { useMatches } from '@remix-run/react'
import { memo, useCallback } from 'react'
import { ImageFull, ImagePreview } from '#app/components/image'
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '#app/components/ui/dialog'
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
				</FlexRow>
				<FlexRow className="mt-2 items-start justify-between">
					<Dialog>
						<DialogTrigger>
							<ImagePreview
								src={getArtworkImgSrc(image.id)}
								alt={image.altText ?? ''}
							/>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>{image.name}</DialogTitle>
								<DialogDescription>{image.altText}</DialogDescription>
							</DialogHeader>
							<ImageFull
								src={getArtworkImgSrc(image.id)}
								alt={image.altText ?? ''}
							/>
						</DialogContent>
					</Dialog>
					<FlexRow className="gap-2">
						<ImageUpdate image={image} />
						<ImageDelete image={image} artwork={artwork} />
					</FlexRow>
				</FlexRow>
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
