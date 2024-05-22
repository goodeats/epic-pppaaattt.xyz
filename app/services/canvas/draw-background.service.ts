import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'

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
