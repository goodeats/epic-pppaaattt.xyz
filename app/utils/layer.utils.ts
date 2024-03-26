import { type ILayer } from '#app/models/layer.server'

export const filterLayersVisible = ({
	layers,
}: {
	layers: ILayer[]
}): ILayer[] => {
	return layers.filter(layer => layer.visible)
}

export const orderLinkedLayers = (layers: ILayer[]): ILayer[] => {
	// Step 1: Find the head of the list
	const head = layers.find(layer => !layer.prevId)
	if (!head) return []

	// Step 2: Sequentially order the layers starting from the head
	const orderedLayers: ILayer[] = [head]
	let currentLayer = head
	while (currentLayer.nextId) {
		let nextId = currentLayer.nextId
		const nextLayer = layers.find(layer => layer.id === nextId)

		if (nextLayer) {
			orderedLayers.push(nextLayer)
			currentLayer = nextLayer
		} else {
			break
		}
	}

	return orderedLayers
}
