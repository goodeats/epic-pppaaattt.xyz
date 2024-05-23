import { useMemo } from 'react'
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
import { ArtworkCanvas } from '#app/components/templates/canvas'
import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'
import 'reactflow/dist/style.css'

const initialNodes = [
	{
		id: 'a',
		type: 'canvas',
		position: { x: 0, y: 0 },
		data: { label: 'artwork-canvas' },
	},
] satisfies Node[]

export const CanvasContent = ({
	generator,
}: {
	generator: IArtworkVersionGenerator
}) => {
	const [nodes, , onNodesChange] = useNodesState(initialNodes)

	const nodeTypes = useMemo(
		() => ({
			canvas: (props: NodeProps) => (
				<ArtworkCanvas {...props} generator={generator} />
			),
		}),
		[generator],
	)

	if (!generator.success) {
		return (
			<ContainerIndex>
				{generator?.message || 'Artwork generator unsuccessful'}
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
