import { type ICanvasDrawItem } from '../../draw.service'

export const drawLayerItemLineService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: ICanvasDrawItem
}) => {
	const { lineWidth } = layerDrawItem
	ctx.lineWidth = lineWidth
}
