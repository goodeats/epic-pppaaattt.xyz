import { type ILayer } from '#app/models/layer/layer.server'

export const filterLayersVisible = ({
	layers,
}: {
	layers: ILayer[]
}): ILayer[] => {
	return layers.filter(layer => layer.visible)
}
