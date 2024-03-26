import { randomInRange } from '#app/utils/random.utils'
import { type IArtboardLayerBuild } from '../../../../queries'

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
	const pixelHex = getPixelHex ? getHexAtPixel({ ctx, x, y }) : null

	return { x, y, pixelHex }
}
// Function to get the hex color value at a specific pixel
const getHexAtPixel = ({
	ctx,
	x,
	y,
}: {
	ctx: CanvasRenderingContext2D
	x: number
	y: number
}) => {
	const pixelData = buildPixelImageData({ ctx, x, y }) // Get the image data at the pixel
	const { r, g, b } = buildPixelRGB({ data: pixelData.data }) // Extract RGB values
	const hex = componentToHex(r) + componentToHex(g) + componentToHex(b) // Convert RGB to hex
	return hex.toUpperCase() // Return the hex value in uppercase
}

// Function to build the image data for a pixel
const buildPixelImageData = ({
	ctx,
	x,
	y,
}: {
	ctx: CanvasRenderingContext2D
	x: number
	y: number
}): ImageData => {
	// image data for a 1x1 pixel area, effectively getting data for a single pixel
	return ctx.getImageData(x, y, 1, 1)
}

// Function to build the RGB values from image data
const buildPixelRGB = ({ data }: { data: Uint8ClampedArray }) => {
	const r = data[0] // Red value
	const g = data[1] // Green value
	const b = data[2] // Blue value
	// The alpha value at index 3 is not included as we are only interested in the RGB values for color representation.
	return { r, g, b }
}

// Function to convert a component of RGB to hex
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString#description
function componentToHex(c: number) {
	const hex = c.toString(16) // Convert the number to hex
	return hex.length == 1 ? '0' + hex : hex // Ensure 2 digits by adding a leading zero if necessary
}
