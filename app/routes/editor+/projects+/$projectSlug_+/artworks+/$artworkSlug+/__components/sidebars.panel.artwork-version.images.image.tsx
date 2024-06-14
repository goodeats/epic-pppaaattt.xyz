import { memo } from 'react'
import { ImageFull, ImagePreview } from '#app/components/image'
import {
	FlexColumn,
	FlexRow,
	ImageSidebarListItem,
} from '#app/components/layout'
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
import { getAssetImgSrc, sizeInMB } from '#app/models/asset/image/utils'
import { AssetImageArtworkCreate } from '#app/routes/resources+/api.v1+/asset.image.artwork.create'
import { AssetImageArtworkDelete } from '#app/routes/resources+/api.v1+/asset.image.artwork.delete'
import { AssetImageArtworkUpdate } from '#app/routes/resources+/api.v1+/asset.image.artwork.update'

const ImageCreate = memo(({ artwork }: { artwork: IArtworkWithAssets }) => {
	return <AssetImageArtworkCreate artwork={artwork} />
})
ImageCreate.displayName = 'ImageCreate'

const ImageUpdate = memo(
	({ image, artwork }: { image: IAssetImage; artwork: IArtworkWithAssets }) => {
		return <AssetImageArtworkUpdate image={image} artwork={artwork} />
	},
)
ImageUpdate.displayName = 'ImageUpdate'

const ImageDelete = memo(
	({ image, artwork }: { image: IAssetImage; artwork: IArtworkWithAssets }) => {
		return <AssetImageArtworkDelete image={image} artwork={artwork} />
	},
)
ImageDelete.displayName = 'ImageDelete'

export const ImageListItem = memo(
	({ image, artwork }: { image: IAssetImage; artwork: IArtworkWithAssets }) => {
		const { id, name, attributes } = image
		const { altText, height, width, size } = attributes
		const imgSrc = getAssetImgSrc({ image })

		return (
			<ImageSidebarListItem key={id}>
				<FlexRow className="items-center">
					<div className="flex-1 truncate">{name}</div>
				</FlexRow>
				<FlexRow className="mt-2 justify-between gap-4">
					<Dialog>
						<DialogTrigger>
							<ImagePreview src={imgSrc} alt={altText ?? ''} />
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>{name}</DialogTitle>
								<DialogDescription>{altText}</DialogDescription>
							</DialogHeader>
							<ImageFull src={imgSrc} alt={altText ?? ''} />
						</DialogContent>
					</Dialog>
					<FlexRow>
						<FlexColumn className="h-full flex-1 items-center justify-between">
							<FlexRow className="w-full justify-end gap-2">
								<ImageUpdate image={image} artwork={artwork} />
								<ImageDelete image={image} artwork={artwork} />
							</FlexRow>
							<FlexColumn className="self-end">
								<FlexRow className="justify-end">
									{width}x{height}
								</FlexRow>
								<FlexRow className="justify-end">
									<div>{sizeInMB(size)} MB</div>
								</FlexRow>
							</FlexColumn>
						</FlexColumn>
					</FlexRow>
				</FlexRow>
			</ImageSidebarListItem>
		)
	},
)
ImageListItem.displayName = 'ImageListItem'
