import { type ICanvasDrawItem } from '../../draw.service'

export const drawLayerItemRotateService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: ICanvasDrawItem
}) => {
	const { rotate } = layerDrawItem

	ctx.rotate(Math.PI * rotate)
}
