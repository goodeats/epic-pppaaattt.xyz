import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'

const canvasDimensions = ({ canvas }: { canvas: HTMLCanvasElement }) => {
	const { width, height } = canvas
	return { width, height, ratio: width / height }
}

// do this at the beginning
export const canvasDrawBackgroundService = ({
	ctx,
	generator,
}: {
	ctx: CanvasRenderingContext2D
	generator: IArtworkVersionGenerator
}) => {
	const { width, height, background } = generator.settings

	ctx.fillStyle = `#${background}`
	ctx.fillRect(0, 0, width, height)
}

// do this if drawing an image to get pixel data
// then redraw the background to clear the canvas
export const canvasRedrawDrawBackgroundService = ({
	ctx,
	background,
}: {
	ctx: CanvasRenderingContext2D
	background: string
}) => {
	const { width: canvasWidth, height: canvasHeight } = canvasDimensions({
		canvas: ctx.canvas,
	})

	ctx.fillStyle = `#${background}`
	ctx.fillRect(0, 0, canvasWidth, canvasHeight)
}
