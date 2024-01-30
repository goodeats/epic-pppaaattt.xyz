import { useLoaderData } from '@remix-run/react'
import { useRef } from 'react'
import {
	ContainerContent,
	ContainerDetails,
	FooterActions,
	FooterContainer,
	FooterTimestamp,
} from '#app/components/shared'
import { DownloadForm } from './download-form'
import { type loader } from './route'

export const CanvasContent = () => {
	const data = useLoaderData<typeof loader>()
	const { artboard } = data
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
		<ContainerDetails>
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
	const data = useLoaderData<typeof loader>()
	const { artboard, artboardTimeAgo } = data
	if (!artboard || !artboardTimeAgo) return null

	return (
		<FooterContainer>
			<FooterTimestamp>{data?.artboardTimeAgo} ago</FooterTimestamp>
			<FooterActions>
				<DownloadForm />
				{/* <FooterLinkButton to="fullscreen" icon="eye-open">
					Fullscreen
				</FooterLinkButton> */}
			</FooterActions>
		</FooterContainer>
	)
}
