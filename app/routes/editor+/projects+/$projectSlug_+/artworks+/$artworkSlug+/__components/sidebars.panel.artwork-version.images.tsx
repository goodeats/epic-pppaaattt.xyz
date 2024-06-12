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
import { type IArtworkWithAssets } from '#app/models/artwork/artwork.server'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { ArtworkImageDelete } from '#app/routes/resources+/api.v1+/artwork.image.delete'
import { ArtworkImageUpdate } from '#app/routes/resources+/api.v1+/artwork.image.update'
import { AssetImageArtworkCreate } from '#app/routes/resources+/api.v1+/asset.image.artwork.create'
import { AssetTypeEnum } from '#app/schema/asset'
import { filterAssetType } from '#app/utils/asset'
import { useRouteLoaderMatchData } from '#app/utils/matches'
import { getArtworkImgSrc } from '#app/utils/misc'
import { artworkVersionLoaderRoute } from '../$branchSlug.$versionSlug'

const ImageCreate = memo(({ artwork }: { artwork: IArtworkWithAssets }) => {
	return <AssetImageArtworkCreate artwork={artwork} />
})
ImageCreate.displayName = 'ImageCreate'

const ImageUpdate = memo(({ image }: { image: IAssetImage }) => {
	return <ArtworkImageUpdate image={image} />
})
ImageUpdate.displayName = 'ImageUpdate'

const ImageDelete = memo(
	({ image, artwork }: { image: IAssetImage; artwork: IArtworkWithAssets }) => {
		return <ArtworkImageDelete image={image} artwork={artwork} />
	},
)
ImageDelete.displayName = 'ImageDelete'

const ImageListItem = memo(
	({ image, artwork }: { image: IAssetImage; artwork: IArtworkWithAssets }) => {
		const { id, name, attributes } = image
		const { altText } = attributes

		return (
			<ImageSidebarListItem key={id}>
				<FlexRow className="items-center">
					<div className="flex-1 truncate">{name}</div>
				</FlexRow>
				<FlexRow className="mt-2 items-start justify-between">
					<Dialog>
						<DialogTrigger>
							<ImagePreview src={getArtworkImgSrc(id)} alt={altText ?? ''} />
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>{name}</DialogTitle>
								<DialogDescription>{altText}</DialogDescription>
							</DialogHeader>
							<ImageFull src={getArtworkImgSrc(id)} alt={altText ?? ''} />
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
	const { assets } = artwork as IArtworkWithAssets
	const images: IAssetImage[] = filterAssetType({
		assets,
		type: AssetTypeEnum.IMAGE,
	})

	const artworkImageCreate = useCallback(
		() => <ImageCreate artwork={artwork as IArtworkWithAssets} />,
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
					{images.length === 0 && (
						<ImageSidebarListItem>
							<div className="text-sm text-muted-foreground">No images</div>
						</ImageSidebarListItem>
					)}
					{images.map(image => (
						<ImageListItem
							key={image.id}
							image={image}
							artwork={artwork as IArtworkWithAssets}
						/>
					))}
				</ImageSidebarList>
			</ImageSidebar>
		</div>
	)
}
