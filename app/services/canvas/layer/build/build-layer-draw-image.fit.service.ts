import { type IAssetImageDrawGeneration } from '#app/models/asset/image/image.generate.server'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { AssetImageFitTypeEnum } from '#app/schema/asset/image'

// https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit

const imageDimensions = ({ image }: { image: IAssetImage }) => {
	const { attributes } = image
	const { width, height } = attributes
	return { width, height, ratio: width / height }
}

const canvasDimensions = ({ canvas }: { canvas: HTMLCanvasElement }) => {
	const { width, height } = canvas
	return { width, height, ratio: width / height }
}

const imageFitFill = ({ ctx }: { ctx: CanvasRenderingContext2D }) => {
	const { width: canvasWidth, height: canvasHeight } = canvasDimensions({
		canvas: ctx.canvas,
	})
	return {
		x: 0,
		y: 0,
		width: canvasWidth,
		height: canvasHeight,
	}
}

const imageFitContain = ({
	ctx,
	image,
}: {
	ctx: CanvasRenderingContext2D
	image: IAssetImage
}) => {
	const {
		// width: imageWidth,
		// height: imageHeight,
		ratio: imageRatio,
	} = imageDimensions({ image })
	const {
		width: canvasWidth,
		height: canvasHeight,
		ratio: canvasRatio,
	} = canvasDimensions({ canvas: ctx.canvas })

	let width = canvasWidth
	let height = canvasHeight

	if (imageRatio > canvasRatio) {
		height = canvasWidth / imageRatio
	} else {
		width = canvasHeight * imageRatio
	}

	return {
		x: (canvasWidth - width) / 2,
		y: (canvasHeight - height) / 2,
		width,
		height,
	}
}

const imageFitCover = ({
	ctx,
	image,
}: {
	ctx: CanvasRenderingContext2D
	image: IAssetImage
}) => {
	const {
		// width: imageWidth,
		// height: imageHeight,
		ratio: imageRatio,
	} = imageDimensions({ image })
	const {
		width: canvasWidth,
		height: canvasHeight,
		ratio: canvasRatio,
	} = canvasDimensions({ canvas: ctx.canvas })

	let width = canvasWidth
	let height = canvasHeight

	if (imageRatio < canvasRatio) {
		height = canvasWidth / imageRatio
	} else {
		width = canvasHeight * imageRatio
	}

	return {
		x: (canvasWidth - width) / 2,
		y: (canvasHeight - height) / 2,
		width,
		height,
	}
}

const imageFitNone = ({
	ctx,
	image,
}: {
	ctx: CanvasRenderingContext2D
	image: IAssetImage
}) => {
	const {
		width: imageWidth,
		height: imageHeight,
		// ratio: imageRatio,
	} = imageDimensions({ image })
	const {
		width: canvasWidth,
		height: canvasHeight,
		// ratio: canvasRatio,
	} = canvasDimensions({ canvas: ctx.canvas })

	return {
		x: (canvasWidth - imageWidth) / 2,
		y: (canvasHeight - imageHeight) / 2,
		width: imageWidth,
		height: imageHeight,
	}
}

const imageFitScaleDown = ({
	ctx,
	image,
}: {
	ctx: CanvasRenderingContext2D
	image: IAssetImage
}) => {
	const {
		width: imageWidth,
		height: imageHeight,
		ratio: imageRatio,
	} = imageDimensions({ image })
	const {
		width: canvasWidth,
		height: canvasHeight,
		ratio: canvasRatio,
	} = canvasDimensions({ canvas: ctx.canvas })

	let width = imageWidth
	let height = imageHeight

	if (imageWidth > canvasWidth || imageHeight > canvasHeight) {
		if (imageRatio > canvasRatio) {
			width = canvasWidth
			height = canvasWidth / imageRatio
		} else {
			height = canvasHeight
			width = canvasHeight * imageRatio
		}
	}

	return {
		x: (canvasWidth - width) / 2,
		y: (canvasHeight - height) / 2,
		width,
		height,
	}
}

export const canvasBuildLayerDrawImageFitService = ({
	ctx,
	image,
}: {
	ctx: CanvasRenderingContext2D
	image: IAssetImage
}): IAssetImageDrawGeneration => {
	switch (image.attributes.fit) {
		case AssetImageFitTypeEnum.FILL:
			return imageFitFill({ ctx })
		case AssetImageFitTypeEnum.CONTAIN:
			return imageFitContain({ ctx, image })
		case AssetImageFitTypeEnum.COVER:
			return imageFitCover({ ctx, image })
		case AssetImageFitTypeEnum.NONE:
			return imageFitNone({ ctx, image })
		case AssetImageFitTypeEnum.SCALE_DOWN:
			return imageFitScaleDown({ ctx, image })
		default:
			return imageFitNone({ ctx, image })
	}
}
