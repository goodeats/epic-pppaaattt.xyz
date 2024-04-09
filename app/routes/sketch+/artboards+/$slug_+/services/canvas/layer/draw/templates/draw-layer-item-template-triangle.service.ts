import { type IGenerationItem } from '#app/definitions/artboard-generator'

export const drawTemplateTriangleService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: IGenerationItem
}) => {
	const { size } = layerDrawItem

	// 0.5 inset creates a flat line
	// greater will bow out
	// less will bow in
	// current settings are for a perfect triangle
	const inset = 0.5
	const points = 3

	// Step 1: get radius
	const radius = getRadius(size)

	// Step 2: draw lines
	drawLines({ ctx, radius, inset, points })
}

// https://byjus.com/question-answer/if-an-equilateral-triangle-is-drawn-inside-a-circle-such-that-the-circle-is-the/
const getRadius = (size: number) => {
	return size / Math.sqrt(3)
}

const drawLines = ({
	ctx,
	radius,
	inset,
	points,
}: {
	ctx: CanvasRenderingContext2D
	radius: number
	inset: number
	points: number
}) => {
	// ctx.lineJoin = 'round'
	// ctx.miterLimit = 1
	// top middle
	ctx.lineTo(0, 0 - radius)
	ctx.rotate(Math.PI / points)
	ctx.lineTo(0, 0 - radius * inset)
	ctx.rotate(Math.PI / points)

	// bottom right
	ctx.lineTo(0, 0 - radius)
	ctx.rotate(Math.PI / points)
	ctx.lineTo(0, 0 - radius * inset)
	ctx.rotate(Math.PI / points)

	// bottom left
	ctx.lineTo(0, 0 - radius)
	ctx.rotate(Math.PI / points)
	ctx.lineTo(0, 0 - radius * inset)
	ctx.rotate(Math.PI / points)

	// closes the path back to the top middle
	ctx.closePath()
}
