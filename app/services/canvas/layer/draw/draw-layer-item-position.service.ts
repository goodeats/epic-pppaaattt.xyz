import { type IGenerationItem } from '#app/definitions/artwork-generator'

export const drawLayerItemPositionService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: IGenerationItem
}) => {
	const { position } = layerDrawItem
	const { x, y } = position

	ctx.translate(x, y)
}
