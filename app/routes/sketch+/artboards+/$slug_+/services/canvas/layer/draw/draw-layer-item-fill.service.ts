import { type ICanvasDrawItem } from '../../draw.service'

export const drawLayerItemFillService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: ICanvasDrawItem
}) => {
	const { fillStyle } = layerDrawItem

	// skip if fillStyle is none
	if (fillStyle === 'none') {
		return
	}

	ctx.fillStyle = `#${fillStyle}`
	ctx.fill()
}
