import { randomInRange } from '#app/utils/random.utils'
import { type IArtboardLayerBuild } from '../../../../queries'
import { ctxPixelCoordColorHex } from '../../ctx.utils'

export const canvasBuildLayerDrawPositionService = ({
	ctx,
	layer,
}: {
	ctx: CanvasRenderingContext2D
	layer: IArtboardLayerBuild
}) => {
	const { container, fill, stroke } = layer
	const { width, height, top, left } = container

	// do margins later

	const x = randomInRange(left, width)
	const y = randomInRange(top, height)

	const getPixelHex = fill.basis === 'pixel' || stroke.basis === 'pixel'
	const pixelHex = getPixelHex ? ctxPixelCoordColorHex({ ctx, x, y }) : null

	return { x, y, pixelHex }
}
