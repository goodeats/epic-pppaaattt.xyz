type PixelCoordColorHexProps = {
	ctx: CanvasRenderingContext2D
	x: number
	y: number
}

export const PixelCoordColorHex = ({ ctx, x, y }: PixelCoordColorHexProps) => {
	const pixelData = buildPixelImageData({ ctx, x, y })
	const { r, g, b } = buildPixelRGB({ data: pixelData.data })
	const hex = '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
	return hex.toUpperCase()
}

const buildPixelImageData = ({
	ctx,
	x,
	y,
}: PixelCoordColorHexProps): ImageData => {
	return ctx.getImageData(x, y, 1, 1)
}

type PixelRGBProps = {
	data: Uint8ClampedArray
}

const buildPixelRGB = ({ data }: PixelRGBProps) => {
	const r = data[0]
	const g = data[1]
	const b = data[2]
	return { r, g, b }
}

// To convert the color values to a hex string, you can use the following function:
// idk chat gpt came up with this and it works
// investigate later if this is acting weird bc I've done this before
function componentToHex(c: number) {
	const hex = c.toString(16)
	return hex.length == 1 ? '0' + hex : hex
}
