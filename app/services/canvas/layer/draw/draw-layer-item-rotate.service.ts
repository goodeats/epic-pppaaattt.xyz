import { type IGenerationItem } from '#app/definitions/artwork-generator'

export const drawLayerItemRotateService = ({
	ctx,
	layerDrawItem,
}: {
	ctx: CanvasRenderingContext2D
	layerDrawItem: IGenerationItem
}) => {
	const { rotate } = layerDrawItem

	ctx.rotate(rotate)
}
