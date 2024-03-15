import { type PickedArtboardType, type IArtboardBuild } from '../../queries'

export const canvasDrawService = ({
	canvas,
	artboard,
	artboardBuild,
}: {
	canvas: HTMLCanvasElement
	artboard: PickedArtboardType
	artboardBuild: IArtboardBuild
}) => {
	console.log('hi')
	const { width, height, backgroundColor } = artboard

	const ctx = getContext(canvas)
	ctx.fillStyle = `#${backgroundColor}`
	ctx.fillRect(0, 0, width, height)
}

const getContext = (canvas: HTMLCanvasElement) => {
	const ctx = canvas.getContext('2d')
	if (!ctx) throw new Error('Canvas context not found')
	return ctx
}
