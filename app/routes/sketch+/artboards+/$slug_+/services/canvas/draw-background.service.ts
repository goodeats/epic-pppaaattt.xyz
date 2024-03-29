import { type PickedArtboardType } from '../../queries'

export const canvasDrawBackgroundService = ({
	ctx,
	artboard,
}: {
	ctx: CanvasRenderingContext2D
	artboard: PickedArtboardType
}) => {
	const { width, height, backgroundColor } = artboard

	ctx.fillStyle = `#${backgroundColor}`
	ctx.fillRect(0, 0, width, height)
}
