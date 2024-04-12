import { prisma } from '#app/utils/db.server'

export const getCountOfAllEntities = async () => {
	const usersCount = await prisma.user.count()
	const artboardsCount = await prisma.artboard.count()
	const artboardBranchesCount = await prisma.artboardBranch.count()
	const artboardVersionsCount = await prisma.artboardVersion.count()
	const layersCount = await prisma.layer.count()
	const designsCount = await prisma.design.count()
	const palettesCount = await prisma.palette.count()

	const entityCounts = {
		usersCount,
		artboardsCount,
		artboardBranchesCount,
		artboardVersionsCount,
		layersCount,
		designsCount,
		palettesCount,
	}

	// feel free to remove or add more entities
	// to be used in the console
	// such as to verify count changes from a script
	console.log(entityCounts)
}
