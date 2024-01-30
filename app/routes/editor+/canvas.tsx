import { useLoaderData } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import {
	ContainerContent,
	ContainerDetails,
	FooterActions,
	FooterContainer,
	FooterIconIndicator,
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

		useEffect(() => {
			const canvas = canvasRef.current
			if (!canvas) return
			const ctx = canvas.getContext('2d')
			if (!ctx) return
			ctx.fillStyle = backgroundColor
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

	const { width, height, backgroundColor } = artboard

	return (
		<FooterContainer>
			<FooterTimestamp>{data?.artboardTimeAgo} ago</FooterTimestamp>
			<FooterIconIndicator icon="dimensions">
				{width} x {height}
			</FooterIconIndicator>
			<FooterIconIndicator icon="color-wheel">
				{backgroundColor}
			</FooterIconIndicator>
			{/* <div className={`w-f h-5 flex-1 bg-[${backgroundColor}]`}></div> */}
			<FooterActions>
				<DownloadForm />
				{/* <FooterLinkButton to="fullscreen" icon="eye-open">
					Fullscreen
				</FooterLinkButton> */}
			</FooterActions>
		</FooterContainer>
	)
}
