import { type IGenerationItem } from '#app/definitions/artwork-generator'

export const drawLayerItemFillService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: IGenerationItem
}) => {
	const { fillStyle } = layerDrawItem

	// skip if fillStyle is none
	if (fillStyle === 'none') {
		return
	}

	ctx.fillStyle = `#${fillStyle}`
	ctx.fill()
}
