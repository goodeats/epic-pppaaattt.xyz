import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FlexColumn } from '#app/components/layout'
import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'
import { canvasDrawService } from '#app/services/canvas/draw.service'
import { CanvasFooter } from './artwork-canvas.footer'

// The ArtworkCanvas component is wrapped in React.memo to optimize performance by memoizing the component.
// This prevents unnecessary re-renders when the props passed to the component have not changed.
// Specifically, since this component involves canvas drawing operations which can be computationally expensive,
// memoizing ensures that these operations are only re-executed when necessary, such as when the 'generator' prop changes.
export const ArtworkCanvas = memo(
	({ generator }: { generator: IArtworkVersionGenerator }) => {
		const { settings } = generator
		const { width, height, background } = settings
		const canvasRef = useRef<HTMLCanvasElement>(null)
		const [refresh, setRefresh] = useState(0)
		let isHydrated = useHydrated()

		useEffect(() => {
			const canvas = canvasRef.current
			if (canvas) {
				canvasDrawService({ canvas, generator })
			}
		}, [canvasRef, generator, refresh])

		const canvasFooter = useCallback(() => {
			const handleRefresh = () => {
				setRefresh(prev => prev + 1)
			}
			return (
				<CanvasFooter
					isHydrated={isHydrated}
					handleRefresh={handleRefresh}
					canvasRef={canvasRef}
					generator={generator}
				/>
			)
		}, [isHydrated, canvasRef, generator])

		return (
			<FlexColumn className="gap-2">
				<canvas
					id="canvas-editor"
					ref={canvasRef}
					width={width}
					height={height}
					style={{ backgroundColor: `#${background}` }}
					className="h-full w-full"
				/>
				{canvasFooter()}
			</FlexColumn>
		)
	},
)
ArtworkCanvas.displayName = 'ArtworkCanvas'
