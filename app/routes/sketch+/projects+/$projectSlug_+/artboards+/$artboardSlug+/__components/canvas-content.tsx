import { useEffect, useRef } from 'react'
import {
	ReactFlow,
	type Node,
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	useNodesState,
} from 'reactflow'
import { ContainerIndex } from '#app/components/shared'
import { type IArtboardVersionGenerator } from '#app/definitions/artboard-generator'
import { canvasDrawService } from '#app/services/canvas/draw.service'
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
	generator,
}: {
	generator: IArtboardVersionGenerator
}) => {
	const { width, height, background } = generator.settings

	const Canvas = () => {
		const canvasRef = useRef<HTMLCanvasElement>(null)

		useEffect(() => {
			const canvas = canvasRef.current
			canvas && canvasDrawService({ canvas, generator })
		}, [canvasRef])

		return (
			<canvas
				id="canvas-editor"
				ref={canvasRef}
				width={width}
				height={height}
				style={{ backgroundColor: `#${background}` }}
			/>
		)
	}

	const [nodes, , onNodesChange] = useNodesState(initialNodes)
	const nodeTypes = {
		canvas: Canvas,
	}

	if (!generator.success) {
		return (
			<ContainerIndex>
				{generator?.message || 'Artboard generator unsuccessful'}
			</ContainerIndex>
		)
	}

	return <p>yo</p>

	return (
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
	)
}
