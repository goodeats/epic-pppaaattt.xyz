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
import { type IArtboardBuild, type PickedArtboardType } from '../queries'
import { canvasDrawService } from '../services/canvas/draw.service'
import 'reactflow/dist/style.css'

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
	artboardBuild,
}: {
	artboard: PickedArtboardType
	artboardBuild: IArtboardBuild | null
}) => {
	const Canvas = () => {
		const { width, height, backgroundColor } = artboard
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

	const [nodes, , onNodesChange] = useNodesState(initialNodes)
	const nodeTypes = {
		canvas: Canvas,
	}
	return (
		<div className="absolute inset-0 flex p-4">
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
		</div>
	)
}
