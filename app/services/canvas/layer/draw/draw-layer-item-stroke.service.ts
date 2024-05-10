import { type IGenerationItem } from '#app/definitions/artboard-generator'

export const drawLayerItemStrokeService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: IGenerationItem
}) => {
	const { strokeStyle } = layerDrawItem
	ctx.strokeStyle = `#${strokeStyle}`
	ctx.stroke()
}
