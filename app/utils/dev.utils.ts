import { prisma } from '#app/utils/db.server'

export const getCountOfAllEntities = async () => {
	const usersCount = await prisma.user.count()
	const artworksCount = await prisma.artwork.count()
	const artworkBranchesCount = await prisma.artworkBranch.count()
	const artworkVersionsCount = await prisma.artworkVersion.count()
	const layersCount = await prisma.layer.count()
	const designsCount = await prisma.design.count()
	const palettesCount = await prisma.palette.count()

	// feel free to remove or add more entities
	// to be used in the console
	// such as to verify count changes from a script
	return {
		usersCount,
		artworksCount,
		artworkBranchesCount,
		artworkVersionsCount,
		layersCount,
		designsCount,
		palettesCount,
	}
}

export const getFullStats = async () => {
	// await prisma.artwork.findMany({
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
	// for (const artwork of artworks) {
	// 	console.log('artwork: ', artwork.name)
	// 	// let artworkLayerDesignCount = 0
	// 	// for (const layer of artwork.layers) {
	// 	// 	for (const designa of layer.designs) {
	// 	// 		// console.log('designa: ', designa.type)
	// 	// 		artworkLayerDesignCount++
	// 	// 	}
	// 	// }
	// 	// for (const version of artwork.versions) {
	// 	// 	// console.log('version: ', version.name)
	// 	// 	// let artworkVersionLayerDesignCount = 0
	// 	// 	// for (const layer of version.layers) {
	// 	// 	// 	console.log('layer: ', layer.name)
	// 	// 	// 	for (const design of layer.designs) {
	// 	// 	// 		// console.log('design: ', design.type)
	// 	// 	// 		artworkVersionLayerDesignCount++
	// 	// 	// 	}
	// 	// 	// }
	// 	// 	// console.log(`designs: artwork ${artwork.designs.length}`)
	// 	// 	// console.log(`designs: version ${version.designs.length}`)
	// 	// 	// console.log(`layers: artwork ${artwork.layers.length} `)
	// 	// 	// console.log(`layers: version ${version.layers.length}`)
	// 	// 	// console.log(`layer designs: artwork ${artworkLayerDesignCount}`)
	// 	// 	// console.log(`layer designs: version ${artworkVersionLayerDesignCount}`)
	// 	// }
	// }
	// const AdesignsCount = await prisma.design.count({
	// 	where: { artworkId: { not: null } },
	// })
	// const AVesignsCount = await prisma.design.count({
	// 	where: { artworkId: { not: null } },
	// })
	// const AdLayersCount = await prisma.layer.count({
	// 	where: { artworkId: { not: null } },
	// })
	// const AVLayersCount = await prisma.layer.count({
	// 	where: { artworkId: { not: null } },
	// })
	// console.log('AdesignsCount: ', AdesignsCount)
	// console.log('AVesignsCount: ', AVesignsCount)
	// console.log('AdLayersCount: ', AdLayersCount)
	// console.log('AVLayersCount: ', AVLayersCount)
}
