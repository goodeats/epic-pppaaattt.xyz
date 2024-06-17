import { type ILayerGenerator } from '#app/definitions/artwork-generator'
import { FillBasisTypeEnum } from '#app/schema/fill'
import { StrokeBasisTypeEnum } from '#app/schema/stroke'

export const shouldGetPixelHex = ({ layer }: { layer: ILayerGenerator }) => {
	const { fill, stroke } = layer
	return (
		fill.attributes.basis === FillBasisTypeEnum.PIXEL ||
		stroke.attributes.basis === StrokeBasisTypeEnum.PIXEL
	)
}

// Function to get the hex color value at a specific pixel
export const getHexAtPixel = ({
	ctx,
	x,
	y,
}: {
	ctx: CanvasRenderingContext2D
	x: number
	y: number
}) => {
	// Adjust the position for the nearest pixel (see below)
	const { xAdj, yAdj } = adjustPositionForNearestPixel({ x, y, ctx })
	// Get the image data at the pixel
	const pixelData = buildPixelImageData({ ctx, x: xAdj, y: yAdj })
	// Extract RGB values from the pixel data
	const { r, g, b } = buildPixelRGB({ data: pixelData.data })
	// Convert RGB to hex
	const hex = componentToHex(r) + componentToHex(g) + componentToHex(b)
	// Return the hex value in uppercase
	return hex.toUpperCase()
}

// if the x or y value are outside the canvas or on right/bottom edge
// there will be no pixel data, so we need to adjust the position
// this is a semi-temporary fix
// sometimes random positions are on the edge
// right/bottom of grid too
const adjustPositionForNearestPixel = ({
	x,
	y,
	ctx,
}: {
	x: number
	y: number
	ctx: CanvasRenderingContext2D
}) => {
	const { canvas } = ctx
	const { width, height } = canvas
	if (x < 0) {
		x = 0
	}
	if (x >= width) {
		x = width - 1
	}
	if (y < 0) {
		y = 0
	}
	if (y >= height) {
		y = height - 1
	}
	return { xAdj: x, yAdj: y }
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
	// Convert the number to hex
	const hex = c.toString(16)
	// Ensure 2 digits by adding a leading zero if necessary
	return hex.length == 1 ? '0' + hex : hex
}
