import { type ICanvasDrawItem } from '../../draw.service'

export const drawLayerItemPositionService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: ICanvasDrawItem
}) => {
	const { position } = layerDrawItem
	const { x, y } = position

	ctx.translate(x, y)
}
