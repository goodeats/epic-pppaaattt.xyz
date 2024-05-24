import { memo, useEffect, useRef } from 'react'
import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'
import { canvasDrawService } from '#app/services/canvas/draw.service'

// The ArtworkCanvas component is wrapped in React.memo to optimize performance by memoizing the component.
// This prevents unnecessary re-renders when the props passed to the component have not changed.
// Specifically, since this component involves canvas drawing operations which can be computationally expensive,
// memoizing ensures that these operations are only re-executed when necessary, such as when the 'generator' prop changes.
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
			<div className="relative h-full w-full">
				<canvas
					id="canvas-editor"
					ref={canvasRef}
					width={width}
					height={height}
					style={{ backgroundColor: `#${background}` }}
					className="h-full w-full"
				/>
			</div>
		)
	},
)
ArtworkCanvas.displayName = 'ArtworkCanvas'
