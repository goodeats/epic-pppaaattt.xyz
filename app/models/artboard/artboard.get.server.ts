import { prisma } from '#app/utils/db.server'
import { type IArtboardWithDesignsAndLayers } from '../artboard.server'

export const getArtboardsWithDesignsAndLayers = async (): Promise<
	IArtboardWithDesignsAndLayers[]
> => {
	const artboards = await prisma.artboard.findMany({
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
			layers: {
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
			},
		},
	})
	return artboards
}
