import { type IArtboardGenerator } from '#app/definitions/artboard-generator'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import 'reactflow/dist/style.css'

// const initialNodes = [
// 	{
// 		id: 'a',
// 		type: 'canvas',
// 		position: { x: 0, y: 0 },
// 		data: { label: 'artboard-canvas' },
// 	},
// ] satisfies Node[]

export const CanvasContent = ({
	version,
	artboardGenerator,
}: {
	version: IArtboardVersion
	artboardGenerator: IArtboardGenerator | null
}) => {
	// const Canvas = () => {
	// 	const { width, height, backgroundColor } = artboard
	// 	const canvasRef = useRef<HTMLCanvasElement>(null)

	// 	useEffect(() => {
	// 		const canvas = canvasRef.current
	// 		const canvasReady = canvas && artboardGenerator
	// 		canvasReady && canvasDrawService({ canvas, artboard, artboardGenerator })
	// 	}, [canvasRef])

	// 	return (
	// 		<canvas
	// 			id="canvas-editor"
	// 			ref={canvasRef}
	// 			width={width}
	// 			height={height}
	// 			style={{ backgroundColor }}
	// 		/>
	// 	)
	// }

	// const [nodes, , onNodesChange] = useNodesState(initialNodes)
	// const nodeTypes = {
	// 	canvas: Canvas,
	// }

	// const ReactFlowComponent = () => {
	// 	return (
	// 		<ReactFlow
	// 			nodes={nodes}
	// 			nodeTypes={nodeTypes}
	// 			onNodesChange={onNodesChange}
	// 			fitView
	// 			minZoom={0.01}
	// 		>
	// 			<Background variant={BackgroundVariant.Dots} />
	// 			<MiniMap pannable zoomable />
	// 			<Controls />
	// 		</ReactFlow>
	// 	)
	// }

	// const FailedComponent = () => {
	// 	return (
	// 		<ContainerIndex>
	// 			{artboardGenerator?.message || 'Artboard generator unsuccessful'}
	// 		</ContainerIndex>
	// 	)
	// }

	// const displayCanvas = artboardGenerator?.success
	return (
		<div id="reactflow-wrapper" className="absolute inset-0">
			<p>todo: build canvas</p>
			{/* {displayCanvas ? <ReactFlowComponent /> : <FailedComponent />} */}
		</div>
	)
}
