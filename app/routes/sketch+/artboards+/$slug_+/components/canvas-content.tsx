import { useEffect, useRef } from 'react'
import { type IArtboardBuild, type PickedArtboardType } from '../queries'
import { canvasDrawService } from '../services/canvas/draw.service'

export const CanvasContent = ({
	artboard,
	artboardBuild,
}: {
	artboard: PickedArtboardType
	artboardBuild: IArtboardBuild | null
}) => {
	const { width, height, backgroundColor } = artboard

	const Canvas = () => {
		const canvasRef = useRef<HTMLCanvasElement>(null)

		useEffect(() => {
			const canvas = canvasRef.current
			const canvasReady = canvas && artboardBuild
			canvasReady && canvasDrawService({ canvas, artboard, artboardBuild })
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
			{/* this was flex was throwing off the canvas aspect ratio */}
			{/* <div className="flex w-full justify-center overflow-y-auto"> */}
			{/* TODO: fix this to a zoomable area, similar to Figma */}
			<div className="w-full overflow-auto">
				{/* <div className="w-full justify-center overflow-auto"> */}
				<Canvas />
			</div>
		</div>
	)
}
