import { memo, useEffect, useRef } from 'react'
import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'
import { canvasDrawService } from '#app/services/canvas/draw.service'

export const ArtworkCanvas = memo(
	({ generator }: { generator: IArtworkVersionGenerator }) => {
		const { width, height, background } = generator.settings
		const canvasRef = useRef<HTMLCanvasElement>(null)

		useEffect(() => {
			const canvas = canvasRef.current
			if (canvas) {
				canvasDrawService({ canvas, generator })
			}
		}, [canvasRef, generator])

		return (
			<canvas
				id="canvas-editor"
				ref={canvasRef}
				width={width}
				height={height}
				style={{ backgroundColor: `#${background}` }}
			/>
		)
	},
)
ArtworkCanvas.displayName = 'ArtworkCanvas'
