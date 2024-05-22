import { type IGenerationItem } from '#app/definitions/artwork-generator'

export const drawLayerItemLineService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: IGenerationItem
}) => {
	const { lineWidth } = layerDrawItem
	ctx.lineWidth = lineWidth
}
