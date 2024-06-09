import { createContainerComponent } from '../layout/utils'

const ImagePreviewContainer = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'w-32',
	displayName: 'ImagePreviewContainer',
})

const ImagePreviewWrapper = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName: 'relative h-32 w-32',
	displayName: 'ImagePreviewWrapper',
})

const ImagePreviewLabel = createContainerComponent({
	defaultTagName: 'label',
	defaultClassName: 'group absolute h-32 w-32 rounded-lg',
	displayName: 'ImagePreviewLabel',
})

const ImagePreview = createContainerComponent({
	defaultTagName: 'img',
	defaultClassName: 'h-32 w-32 rounded-lg object-cover',
	displayName: 'ImagePreview',
})

const noImagePreviewClassName =
	'bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100'

const ImagePreviewSkeleton = createContainerComponent({
	defaultTagName: 'div',
	defaultClassName:
		'flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground',
	displayName: 'ImagePreviewSkeleton',
})

const ImageUploadInput = createContainerComponent({
	defaultTagName: 'input',
	defaultClassName:
		'absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0',
	displayName: 'ImageUploadInput',
})

const ImageFull = createContainerComponent({
	defaultTagName: 'img',
	defaultClassName: 'w-full object-contain',
	displayName: 'ImageFull',
})

export {
	ImagePreviewContainer,
	ImagePreviewWrapper,
	ImagePreviewLabel,
	ImagePreview,
	noImagePreviewClassName,
	ImagePreviewSkeleton,
	ImageUploadInput,
	ImageFull,
}
