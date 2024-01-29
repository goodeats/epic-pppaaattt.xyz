import { useRouteLoaderData } from '@remix-run/react'
import { useRef } from 'react'
import {
	ContainerContent,
	ContainerDetails,
	FooterActions,
	FooterContainer,
	FooterLinkButton,
	FooterTimestamp,
} from '#app/components/shared'
import { type loader as routeLoader } from '../route'

export const CanvasContent = () => {
	const data = useRouteLoaderData<typeof routeLoader>('routes/editor+/route')
	const artboard = data?.artboard
	if (!artboard) return null

	const { width, height, backgroundColor } = artboard

	const Canvas = () => {
		const canvasRef = useRef<HTMLCanvasElement>(null)

		// useEffect(() => {
		//   const canvas = canvasRef.current;
		//   canvas && CanvasDraw({ canvas, buildAttributes });
		// }, []);

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
		<ContainerDetails className="mt-16">
			{/* mt-16 moves content below header */}
			<ContainerContent displayBar={true}>
				<CanvasContainer>
					<Canvas />
				</CanvasContainer>
			</ContainerContent>
			<Footer />
		</ContainerDetails>
	)
}

// set explicit height on container so canvas does not overflow (width)
// consider checking parent size and setting canvas size to match in canvas styles prop
// see how Matt Desl does it in https://github.com/mattdesl/canvas-sketch/blob/master/lib/core/resizeCanvas.js
const CanvasContainer = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div className="mt-2 flex h-96 w-full justify-center overflow-y-auto bg-muted p-4 lg:mt-6">
			{children}
		</div>
	)
}

export const Footer = () => {
	const data = useRouteLoaderData<typeof routeLoader>('routes/editor+/route')
	const artboardTimeAgo = data?.artboardTimeAgo
	if (!artboardTimeAgo) return null

	return (
		<FooterContainer>
			<FooterTimestamp>{data?.artboardTimeAgo} ago</FooterTimestamp>
			<FooterActions>
				<FooterLinkButton to="fullscreen" icon="eye-open">
					Fullscreen
				</FooterLinkButton>
			</FooterActions>
		</FooterContainer>
	)
}
