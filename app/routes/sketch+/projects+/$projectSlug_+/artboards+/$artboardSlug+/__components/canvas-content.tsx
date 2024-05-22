import { memo, useEffect, useMemo, useRef } from 'react'
import {
	ReactFlow,
	type Node,
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	useNodesState,
	type NodeProps,
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

const ArtboardCanvas = memo(
	({ generator }: { generator: IArtboardVersionGenerator }) => {
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
ArtboardCanvas.displayName = 'ArtboardCanvas'

export const CanvasContent = ({
	generator,
}: {
	generator: IArtboardVersionGenerator
}) => {
	const [nodes, , onNodesChange] = useNodesState(initialNodes)

	const nodeTypes = useMemo(
		() => ({
			canvas: (props: NodeProps) => (
				<ArtboardCanvas {...props} generator={generator} />
			),
		}),
		[generator],
	)

	if (!generator.success) {
		return (
			<ContainerIndex>
				{generator?.message || 'Artboard generator unsuccessful'}
			</ContainerIndex>
		)
	}

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
