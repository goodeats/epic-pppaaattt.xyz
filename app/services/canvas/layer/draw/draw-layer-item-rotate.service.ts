import { type IGenerationItem } from '#app/definitions/artboard-generator'

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
