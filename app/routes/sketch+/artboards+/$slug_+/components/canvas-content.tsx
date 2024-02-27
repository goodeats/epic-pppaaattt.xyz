import { useEffect, useRef } from 'react'
import { type PickedArtboardType } from '../queries'

export const CanvasContent = ({
	artboard,
}: {
	artboard: PickedArtboardType
}) => {
	const { width, height, backgroundColor } = artboard

	const Canvas = () => {
		const canvasRef = useRef<HTMLCanvasElement>(null)

		useEffect(() => {
			const canvas = canvasRef.current
			if (!canvas) return
			const ctx = canvas.getContext('2d')
			if (!ctx) return
			ctx.fillStyle = `#${backgroundColor}`
			ctx.fillRect(0, 0, width, height)
			// canvas && CanvasDraw({ canvas, buildAttributes });
		}, [canvasRef])

		return (
			<canvas
				id="canvas-editor"
				ref={canvasRef}
				width={width}
				height={height}
				style={{ backgroundColor }}
			/>
		)
	}

	return (
		<div className="absolute inset-0 flex p-4">
			<div className="flex w-full justify-center overflow-y-auto">
				<Canvas />
			</div>
		</div>
	)
}
