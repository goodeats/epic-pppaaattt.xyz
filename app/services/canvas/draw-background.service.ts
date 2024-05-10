import { type IArtboardVersionGenerator } from '#app/definitions/artboard-generator'

export const canvasDrawBackgroundService = ({
	ctx,
	generator,
}: {
	ctx: CanvasRenderingContext2D
	generator: IArtboardVersionGenerator
}) => {
	const { width, height, background } = generator.settings

	ctx.fillStyle = `#${background}`
	ctx.fillRect(0, 0, width, height)
}
