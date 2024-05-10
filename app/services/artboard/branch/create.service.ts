import { invariant } from '@epic-web/invariant'
import {
	createArtboardBranch,
	type IArtboardBranchCreatedResponse,
} from '#app/models/artboard-branch/artboard-branch.create.server'
import { getArtboardBranch } from '#app/models/artboard-branch/artboard-branch.get.server'
import { type IArtboardBranch } from '#app/models/artboard-branch/artboard-branch.server'
import { createArtboardVersion } from '#app/models/artboard-version/artboard-version.create.server'
import { getArtboardVersion } from '#app/models/artboard-version/artboard-version.get.server'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type IArtboard } from '#app/models/artboard/artboard.server'
import { type IUser } from '#app/models/user/user.server'
import { ArtboardBranchDataCreateSchema } from '#app/schema/artboard-branch'
import { ArtboardVersionDataCreateSchema } from '#app/schema/artboard-version'
import { DesignCloneSourceTypeEnum } from '#app/schema/design'
import { LayerCloneSourceTypeEnum } from '#app/schema/layer'
import { stringToSlug } from '#app/utils/misc'
import { artboardVersionCloneDesignsService } from '../version/clone-designs.service'
import { artboardVersionCloneLayersService } from '../version/clone-layers.service'

export const artboardBranchCreateService = async ({
	userId,
	id,
	artboardId,
	versionId,
	name,
	description,
}: {
	userId: IUser['id']
	id: IArtboardBranch['id']
	artboardId: IArtboard['id']
	versionId: IArtboardVersion['id']
	name: string
	description?: string
}): Promise<IArtboardBranchCreatedResponse> => {
	try {
		// Step 1: find the current artboard branch
		// this could be the root branch ("main")
		// or this could be a child branch
		// get this for its name
		const currentArtboardBranch = await getArtboardBranch({
			where: { id, ownerId: userId },
		})
		invariant(currentArtboardBranch, 'Current artboard branch not found')

		// Step 2: get data for new artboard branch
		const branchData = ArtboardBranchDataCreateSchema.parse({
			ownerId: userId,
			artboardId,
			parentId: id,
			name,
			slug: stringToSlug(name),
			description:
				description || `New branch from ${currentArtboardBranch.name}`,
		})

		// Step 3: create the new artboard branch
		const createdArtboardBranch = await createArtboardBranch({
			data: branchData,
		})
		invariant(createdArtboardBranch, 'New artboard branch not created')

		// Step 4: get the current version of the artboard branch
		// NOTE: do not use artboardVersionCreateService
		// as that will attempt to connect versions from different branches
		const currentArtboardVersion = await getArtboardVersion({
			where: { id: versionId, branchId: id, ownerId: userId },
		})
		invariant(currentArtboardVersion, 'Current artboard version not found')

		// Step 5: get data for new branch initial version
		const { width, height, background } = currentArtboardVersion
		const versionData = ArtboardVersionDataCreateSchema.parse({
			ownerId: userId,
			branchId: createdArtboardBranch.id,
			description: `New branch from ${currentArtboardBranch.name}, version ${currentArtboardVersion.name}`,
			width,
			height,
			background,
		})

		// Step 6: create new artboard version
		const createdArtboardVersion = await createArtboardVersion({
			data: versionData,
		})
		invariant(createdArtboardVersion, 'New artboard version not created')

		// Step 7: copy contents of previous artboard version to new artboard version
		await artboardVersionCloneDesignsService({
			userId,
			sourceEntityType: DesignCloneSourceTypeEnum.ARTBOARD_VERSION,
			sourceEntityId: currentArtboardVersion.id,
			targetEntityId: createdArtboardVersion.id,
		})
		await artboardVersionCloneLayersService({
			userId,
			sourceEntityType: LayerCloneSourceTypeEnum.ARTBOARD_VERSION,
			sourceEntityId: currentArtboardVersion.id,
			targetEntityId: createdArtboardVersion.id,
		})

		return {
			createdArtboardBranch,
			success: true,
		}
	} catch (error) {
		console.log(error)
		return {
			success: false,
			message: 'Unknown error creating artboard generator.',
		}
	}
}
