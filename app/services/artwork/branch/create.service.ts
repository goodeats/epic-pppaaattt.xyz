import { invariant } from '@epic-web/invariant'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import {
	createArtworkBranch,
	type IArtworkBranchCreatedResponse,
} from '#app/models/artwork-branch/artwork-branch.create.server'
import { getArtworkBranch } from '#app/models/artwork-branch/artwork-branch.get.server'
import { type IArtworkBranch } from '#app/models/artwork-branch/artwork-branch.server'
import { createArtworkVersion } from '#app/models/artwork-version/artwork-version.create.server'
import { getArtworkVersion } from '#app/models/artwork-version/artwork-version.get.server'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type IUser } from '#app/models/user/user.server'
import { ArtworkBranchDataCreateSchema } from '#app/schema/artwork-branch'
import { ArtworkVersionDataCreateSchema } from '#app/schema/artwork-version'
import { DesignCloneSourceTypeEnum } from '#app/schema/design'
import { LayerCloneSourceTypeEnum } from '#app/schema/layer'
import { stringToSlug } from '#app/utils/misc'
import { artworkVersionCloneDesignsService } from '../version/clone-designs.service'
import { artworkVersionCloneLayersService } from '../version/clone-layers.service'

export const artworkBranchCreateService = async ({
	userId,
	id,
	artworkId,
	versionId,
	name,
	description,
}: {
	userId: IUser['id']
	id: IArtworkBranch['id']
	artworkId: IArtwork['id']
	versionId: IArtworkVersion['id']
	name: string
	description?: string
}): Promise<IArtworkBranchCreatedResponse> => {
	try {
		// Step 1: find the current artwork branch
		// this could be the root branch ("main")
		// or this could be a child branch
		// get this for its name
		const currentArtworkBranch = await getArtworkBranch({
			where: { id, ownerId: userId },
		})
		invariant(currentArtworkBranch, 'Current artwork branch not found')

		// Step 2: get data for new artwork branch
		const branchData = ArtworkBranchDataCreateSchema.parse({
			ownerId: userId,
			artworkId,
			parentId: id,
			name,
			slug: stringToSlug(name),
			description:
				description || `New branch from ${currentArtworkBranch.name}`,
		})

		// Step 3: create the new artwork branch
		const createdArtworkBranch = await createArtworkBranch({
			data: branchData,
		})
		invariant(createdArtworkBranch, 'New artwork branch not created')

		// Step 4: get the current version of the artwork branch
		// NOTE: do not use artworkVersionCreateService
		// as that will attempt to connect versions from different branches
		const currentArtworkVersion = await getArtworkVersion({
			where: { id: versionId, branchId: id, ownerId: userId },
		})
		invariant(currentArtworkVersion, 'Current artwork version not found')

		// Step 5: get data for new branch initial version
		const { width, height, background } = currentArtworkVersion
		const versionData = ArtworkVersionDataCreateSchema.parse({
			ownerId: userId,
			branchId: createdArtworkBranch.id,
			description: `New branch from ${currentArtworkBranch.name}, version ${currentArtworkVersion.name}`,
			width,
			height,
			background,
		})

		// Step 6: create new artwork version
		const createdArtworkVersion = await createArtworkVersion({
			data: versionData,
		})
		invariant(createdArtworkVersion, 'New artwork version not created')

		// Step 7: copy contents of previous artwork version to new artwork version
		await artworkVersionCloneDesignsService({
			userId,
			sourceEntityType: DesignCloneSourceTypeEnum.ARTWORK_VERSION,
			sourceEntityId: currentArtworkVersion.id,
			targetEntityId: createdArtworkVersion.id,
		})
		await artworkVersionCloneLayersService({
			userId,
			sourceEntityType: LayerCloneSourceTypeEnum.ARTWORK_VERSION,
			sourceEntityId: currentArtworkVersion.id,
			targetEntityId: createdArtworkVersion.id,
		})

		return {
			createdArtworkBranch,
			success: true,
		}
	} catch (error) {
		console.log(error)
		return {
			success: false,
			message: 'Unknown error creating artwork generator.',
		}
	}
}
