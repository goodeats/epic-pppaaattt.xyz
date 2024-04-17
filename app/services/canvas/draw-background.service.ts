import { type IArtboardVersionGenerator } from '#app/definitions/artboard-generator'

export const canvasDrawBackgroundService = ({
	ctx,
	generator,
}: {
	ctx: CanvasRenderingContext2D
	generator: IArtboardVersionGenerator
}) => {
	const { width, height, backgroundColor } = generator.settings

	ctx.fillStyle = `#${backgroundColor}`
	ctx.fillRect(0, 0, width, height)
}
