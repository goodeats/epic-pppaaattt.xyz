import { type ILayerGenerator } from '#app/definitions/artwork-generator'
import { LayoutStyleTypeEnum } from '#app/schema/layout'
import { randomInRange } from '#app/utils/random.utils'
import { getGridPosition } from './build-layer-draw-position.grid.service'
import {
	getHexAtPixel,
	shouldGetPixelHex,
} from './build-layer-draw-position.pixel.service'

export const canvasBuildLayerDrawPositionService = ({
	ctx,
	layer,
	index,
}: {
	ctx: CanvasRenderingContext2D
	layer: ILayerGenerator
	index: number
}): {
	x: number
	y: number
	pixelHex: string | null
} => {
	const { x, y } = getPosition({ layer, index, ctx })

	const getPixelHex = shouldGetPixelHex({ layer })
	const pixelHex = getPixelHex ? getHexAtPixel({ ctx, x, y }) : null

	return { x, y, pixelHex }
}

const getPosition = ({
	layer,
	index,
	ctx,
}: {
	layer: ILayerGenerator
	index: number
	ctx: CanvasRenderingContext2D
}) => {
	const { layout } = layer

	if (layout.style === LayoutStyleTypeEnum.GRID) {
		return getGridPosition({ layer, index, ctx })
	}

	// LayoutStyleTypeEnum.RANDOM
	return getRandomPosition({ layer })
}

const getRandomPosition = ({ layer }: { layer: ILayerGenerator }) => {
	const { container } = layer
	const { width, height, top, left } = container
	// add margin later
	const x = randomInRange(left, width)
	const y = randomInRange(top, height)
	return { x, y }
}
