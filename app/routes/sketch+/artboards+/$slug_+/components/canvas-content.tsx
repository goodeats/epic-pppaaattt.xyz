import { useEffect, useRef } from 'react'
import {
	ReactFlow,
	type Node,
	Background,
	Controls,
	MiniMap,
	useNodesState,
	BackgroundVariant,
} from 'reactflow'
import { ContainerIndex } from '#app/components/shared'
import {
	type IArtboardVersionGenerator,
	type IArtboardGenerator,
} from '#app/definitions/artboard-generator'
import 'reactflow/dist/style.css'
import { type PickedArtboardType } from '#app/models/artboard.server'
import { canvasDrawService } from '#app/services/canvas/draw.service'

const initialNodes = [
	{
		id: 'a',
		type: 'canvas',
		position: { x: 0, y: 0 },
		data: { label: 'artboard-canvas' },
	},
] satisfies Node[]

export const CanvasContent = ({
	artboard,
	artboardGenerator,
}: {
	artboard: PickedArtboardType
	artboardGenerator: IArtboardGenerator | null
}) => {
	const { width, height, backgroundColor } = artboard
	const generator = {
		...artboardGenerator,
		settings: {
			width,
			height,
			backgroundColor,
		},
	} as IArtboardVersionGenerator

	const Canvas = () => {
		const canvasRef = useRef<HTMLCanvasElement>(null)

		useEffect(() => {
			const canvas = canvasRef.current
			const canvasReady = canvas && artboardGenerator

			canvasReady && canvasDrawService({ canvas, generator })
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

	const [nodes, , onNodesChange] = useNodesState(initialNodes)
	const nodeTypes = {
		canvas: Canvas,
	}
	return (
		<div id="reactflow-wrapper" className="absolute inset-0">
			{artboardGenerator?.success ? (
				<ReactFlow
					nodes={nodes}
					nodeTypes={nodeTypes}
					onNodesChange={onNodesChange}
					fitView
					minZoom={0.01}
				>
					<Background variant={BackgroundVariant.Dots} />
					<MiniMap pannable zoomable />
					<Controls />
				</ReactFlow>
			) : (
				<ContainerIndex>
					{artboardGenerator?.message || 'Artboard generator unsuccessful'}
				</ContainerIndex>
			)}
		</div>
	)
}
