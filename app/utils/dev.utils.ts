import { prisma } from '#app/utils/db.server'

export const getCountOfAllEntities = async () => {
	const usersCount = await prisma.user.count()
	const artboardsCount = await prisma.artboard.count()
	const artboardBranchesCount = await prisma.artboardBranch.count()
	const artboardVersionsCount = await prisma.artboardVersion.count()
	const layersCount = await prisma.layer.count()
	const designsCount = await prisma.design.count()
	const palettesCount = await prisma.palette.count()

	// feel free to remove or add more entities
	// to be used in the console
	// such as to verify count changes from a script
	return {
		usersCount,
		artboardsCount,
		artboardBranchesCount,
		artboardVersionsCount,
		layersCount,
		designsCount,
		palettesCount,
	}
}

export const getFullStats = async () => {
	// await prisma.artboard.findMany({
	// 	include: {
	// 		designs: true,
	// 		layers: {
	// 			include: {
	// 				designs: true,
	// 			},
	// 		},
	// 		versions: {
	// 			include: {
	// 				designs: true,
	// 				layers: {
	// 					include: {
	// 						designs: true,
	// 					},
	// 				},
	// 			},
	// 		},
	// 	},
	// })
	// for (const artboard of artboards) {
	// 	console.log('artboard: ', artboard.name)
	// 	// let artboardLayerDesignCount = 0
	// 	// for (const layer of artboard.layers) {
	// 	// 	for (const designa of layer.designs) {
	// 	// 		// console.log('designa: ', designa.type)
	// 	// 		artboardLayerDesignCount++
	// 	// 	}
	// 	// }
	// 	// for (const version of artboard.versions) {
	// 	// 	// console.log('version: ', version.name)
	// 	// 	// let artboardVersionLayerDesignCount = 0
	// 	// 	// for (const layer of version.layers) {
	// 	// 	// 	console.log('layer: ', layer.name)
	// 	// 	// 	for (const design of layer.designs) {
	// 	// 	// 		// console.log('design: ', design.type)
	// 	// 	// 		artboardVersionLayerDesignCount++
	// 	// 	// 	}
	// 	// 	// }
	// 	// 	// console.log(`designs: artboard ${artboard.designs.length}`)
	// 	// 	// console.log(`designs: version ${version.designs.length}`)
	// 	// 	// console.log(`layers: artboard ${artboard.layers.length} `)
	// 	// 	// console.log(`layers: version ${version.layers.length}`)
	// 	// 	// console.log(`layer designs: artboard ${artboardLayerDesignCount}`)
	// 	// 	// console.log(`layer designs: version ${artboardVersionLayerDesignCount}`)
	// 	// }
	// }
	// const AdesignsCount = await prisma.design.count({
	// 	where: { artboardId: { not: null } },
	// })
	// const AVesignsCount = await prisma.design.count({
	// 	where: { artboardId: { not: null } },
	// })
	// const AdLayersCount = await prisma.layer.count({
	// 	where: { artboardId: { not: null } },
	// })
	// const AVLayersCount = await prisma.layer.count({
	// 	where: { artboardId: { not: null } },
	// })
	// console.log('AdesignsCount: ', AdesignsCount)
	// console.log('AVesignsCount: ', AVesignsCount)
	// console.log('AdLayersCount: ', AdLayersCount)
	// console.log('AVLayersCount: ', AVLayersCount)
}
