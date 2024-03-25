import { type ICanvasDrawItem } from '../../draw.service'

export const drawLayerItemStrokeService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: ICanvasDrawItem
}) => {
	const { strokeStyle } = layerDrawItem
	ctx.strokeStyle = `#${strokeStyle}`
	ctx.stroke()
}
