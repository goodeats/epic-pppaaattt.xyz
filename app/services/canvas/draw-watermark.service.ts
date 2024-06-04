import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'
import { ctxBegin, ctxEnd } from './ctx.utils'

export const canvasDrawWatermarkService = ({
	ctx,
	generator,
}: {
	ctx: CanvasRenderingContext2D
	generator: IArtworkVersionGenerator
}) => {
	if (!generator.watermark) return
	const { text } = generator.watermark

	// Step 1: begin ctx
	ctxBegin({ ctx })

	// Step 2: get canvas dimensions
	const canvasWidth = ctx.canvas.width
	const canvasHeight = ctx.canvas.height

	// Step 3: set text properties
	const textMargin = canvasWidth / 20
	const fontSize = canvasHeight / 50
	ctx.font = `${fontSize}px Helvetica, sans-serif`
	ctx.font = `900 ${ctx.font}` // Set font weight to 900 (extra-bold)
	ctx.fillStyle = '#000000'
	ctx.lineWidth = 2
	const metrics = ctx.measureText(text)
	const textWidth = metrics.width

	// Step 4: set text position
	const xPosition = canvasWidth - textWidth - textMargin
	const yPosition = canvasHeight - textMargin

	// Step 5: draw text
	ctx.fillText(text, xPosition, yPosition)

	// Final Step: end ctx
	ctxEnd({ ctx })
}
