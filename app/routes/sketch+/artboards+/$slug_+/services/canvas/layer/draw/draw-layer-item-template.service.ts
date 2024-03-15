import { type ICanvasDrawItem } from '../../draw.service'
import { drawTemplateTriangleService } from './templates/draw-layer-item-template-triangle.service'

export const drawLayerItemTemplateService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: ICanvasDrawItem
}) => {
	const { position, rotate } = layerDrawItem
	const { x, y } = position

	// Step 1: set position
	setContextPosition({ ctx, x, y })

	// Step 2: set rotation
	setContextRotate({ ctx, rotate })

	// Step 3: draw the template
	drawTemplate({ ctx, layerDrawItem })
}

const setContextPosition = ({
	ctx,
	x,
	y,
}: {
	ctx: CanvasRenderingContext2D
	x: number
	y: number
}) => {
	ctx.translate(x, y)
}

const setContextRotate = ({
	ctx,
	rotate,
}: {
	ctx: CanvasRenderingContext2D
	rotate: number
}) => {
	ctx.rotate(Math.PI * rotate)
}

const drawTemplate = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: ICanvasDrawItem
}) => {
	const { template } = layerDrawItem

	if (template === 'triangle') {
		drawTemplateTriangleService({ ctx, layerDrawItem })
	}

	return
}
