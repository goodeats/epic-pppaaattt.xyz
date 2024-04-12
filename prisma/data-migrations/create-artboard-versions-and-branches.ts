import { getArtboardsWithDesignsAndLayers } from '#app/models/artboard/artboard.get.server'
import { type IArtboardVersion } from '#app/models/artboard-version.server'
import { type IArtboardWithDesignsAndLayers } from '#app/models/artboard.server'
import { artboardBranchCreateService } from '#app/routes/sketch+/artboards+/$slug_+/services/artboard/branch/create.service'
import { artboardVersionCloneDesignsService } from '#app/routes/sketch+/artboards+/$slug_+/services/artboard/version/clone-designs.service'
import { artboardVersionCloneLayersService } from '#app/routes/sketch+/artboards+/$slug_+/services/artboard/version/clone-layers.service'
import { prisma } from '#app/utils/db.server'

// artboards will have version control now
// new prisma migration created the following tables:
// - ArtboardVersion, ArtboardBranch, ArtboardMergeRequest
// and the following changes to existing tables:
// - artboard: has many versions, branches, mergeRequests
// - layer: added artboardVersion, artboardBranch
// - design: added artboardVersion, artboardBranch

// the goal of this script:
// - for each artboard
// - - create a new version (latest)
// - - create a new branch (main)
// - - deep copy layers and designs to the new version and branch

// after this script runs, there is more work to do:
// - routing, ui, and api changes to support artboard versions and branches

// how to run:
// add the folowing to package.json scripts:
// "data:migrate": "npx vite-node ./prisma/data-migrations/create-artboard-versions-and-branches.ts"
// then run `npm run data:migrate`
// then remove the script from package.json

export const createArtboardVersionsBranches = async () => {
	console.log('createArtboardVersionsBranches begin 🎬')

	// Step 1: get all artboards
	// with their designs, layers, and layers' designs
	const artboards = await getArtboards()

	// Step 2: for each artboard
	artboards.map(async (artboard: IArtboardWithDesignsAndLayers) => {
		console.log('artboard: ', artboard.name)
		// Step 3: create a new branch (default) and version (latest)
		const artboardVersions = await createArtboardBranchWithVersion({ artboard })

		// Step 5: for each artboard version (only 1)
		artboardVersions.map(async (artboardVersion: IArtboardVersion) => {
			console.log('artboardVersion: ', artboardVersion.name)
			// Step 6: clone artboard designs
			await cloneArtboardVersionDesigns({ artboard, artboardVersion })
			// Step 7: clone artboard layers
			await cloneArtboardVersionLayers({ artboard, artboardVersion })
			// Step 8: clone artboard layers designs
		})
	})

	// remove this when ready
	await clear()

	console.log('createArtboardVersionsBranches end 🏁')
}

const getArtboards = async (): Promise<IArtboardWithDesignsAndLayers[]> => {
	return await getArtboardsWithDesignsAndLayers()
}

const createArtboardBranchWithVersion = async ({
	artboard,
}: {
	artboard: IArtboardWithDesignsAndLayers
}): Promise<IArtboardVersion[]> => {
	const { artboardBranch } = await artboardBranchCreateService({
		artboard,
	})

	if (!artboardBranch) {
		throw new Error('createArtboardBranchWithVersion failed')
	}

	return artboardBranch.versions
}

const cloneArtboardVersionDesigns = async ({
	artboard,
	artboardVersion,
}: {
	artboard: IArtboardWithDesignsAndLayers
	artboardVersion: IArtboardVersion
}) => {
	return await artboardVersionCloneDesignsService({
		userId: artboard.ownerId,
		sourceEntityId: artboard.id,
		targetEntityId: artboardVersion.id,
	})
}

const cloneArtboardVersionLayers = async ({
	artboard,
	artboardVersion,
}: {
	artboard: IArtboardWithDesignsAndLayers
	artboardVersion: IArtboardVersion
}) => {
	return await artboardVersionCloneLayersService({
		userId: artboard.ownerId,
		sourceEntityId: artboard.id,
		targetEntityId: artboardVersion.id,
	})
}

const clear = async () => {
	await prisma.artboardBranch.deleteMany()
	await prisma.artboardVersion.deleteMany()
}

await createArtboardVersionsBranches()
