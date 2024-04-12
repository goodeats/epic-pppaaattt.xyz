import { createDefaultArtboardBranchWithVersion } from '#app/models/artboard-branch/artboard-branch.create.server'
import { type IArtboardBranchWithVersions } from '#app/models/artboard-branch/artboard-branch.server'
import { type IArtboard } from '#app/models/artboard.server'

export const artboardBranchCreateService = async ({
	artboard,
}: {
	artboard: IArtboard
}): Promise<{
	artboardBranch?: IArtboardBranchWithVersions
	success: boolean
	message: string
}> => {
	try {
		// Step 1: assume this is the only artboard branch :D
		const createdArtboardBranch = await createDefaultArtboardBranchWithVersion({
			artboard,
		})
		if (!createdArtboardBranch) throw new Error('Artboard branch not created.')

		return {
			artboardBranch: createdArtboardBranch,
			success: true,
			message: 'Artboard branch created successfully.',
		}
	} catch (error) {
		console.log(error)
		return {
			success: false,
			message: 'Unknown error creating artboard generator.',
		}
	}
}
