import { type whereArgsType } from '#app/schema/layer'
import { prisma } from '#app/utils/db.server'
import { type ILayer, type ILayerWithDesigns } from '../layer/layer.server'

export const getLayersWithDesigns = async ({
	where,
}: {
	where: whereArgsType
}): Promise<ILayerWithDesigns[]> => {
	const layers = await prisma.layer.findMany({
		where,
		include: {
			designs: {
				include: {
					palette: true,
					size: true,
					fill: true,
					stroke: true,
					line: true,
					rotate: true,
					layout: true,
					template: true,
				},
			},
		},
	})
	return layers
}

export const getLayer = async ({
	where,
}: {
	where: whereArgsType
}): Promise<ILayer | null> => {
	const layer = await prisma.layer.findFirst({
		where,
	})
	return layer
}
