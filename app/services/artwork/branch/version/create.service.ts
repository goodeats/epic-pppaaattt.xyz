import { invariant } from '@epic-web/invariant'
import { type User } from '@prisma/client'
import { type IArtworkBranch } from '#app/models/artwork-branch/artwork-branch.server'
import {
	type IArtworkVersionCreatedResponse,
	incrementVersionNameString,
	createArtworkVersion,
} from '#app/models/artwork-version/artwork-version.create.server'
import { deleteArtworkVersions } from '#app/models/artwork-version/artwork-version.delete.server'
import {
	getArtworkVersion,
	getArtworkVersions,
} from '#app/models/artwork-version/artwork-version.get.server'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { connectPrevAndNext } from '#app/models/artwork-version/artwork-version.update.server'
import { ArtworkVersionDataCreateSchema } from '#app/schema/artwork-version'
import { DesignCloneSourceTypeEnum } from '#app/schema/design'
import { LayerCloneSourceTypeEnum } from '#app/schema/layer'
import { prisma } from '#app/utils/db.server'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { artworkVersionCloneDesignsService } from '../../version/clone-designs.service'
import { artworkVersionCloneLayersService } from '../../version/clone-layers.service'

// copy contents of previous artwork version to new artwork version

export const artworkVersionCreateService = async ({
	userId,
	id,
	artworkBranchId,
	description,
}: {
	userId: User['id']
	id: IArtworkVersion['id']
	artworkBranchId: IArtworkBranch['id']
	description: string
}): Promise<IArtworkVersionCreatedResponse> => {
	try {
		// Step 1: find the current artwork version
		// this could be the tail
		// or this could be an earlier version where the version history is being reset
		// aka undo, undo, undo, new version edits
		const currentArtworkVersion = await getArtworkVersion({
			where: { id, ownerId: userId },
		})
		invariant(currentArtworkVersion, 'Current artwork version not found')

		// Step 2: get data for new artwork version
		const { name, width, height, background } = currentArtworkVersion
		const newName = incrementVersionNameString(name)
		const data = ArtworkVersionDataCreateSchema.parse({
			ownerId: userId,
			branchId: artworkBranchId,
			name: newName,
			slug: newName,
			description: description || 'new version',
			width,
			height,
			background,
		})

		// Step 3: delete all artwork versions after the current artwork version
		// getting multiple heads and tails on v1...
		const artworkVersions = await getArtworkVersions({
			where: { branchId: artworkBranchId },
		})
		const deleteArtworkVersionsPromise = deleteArtworkVersionsAfterCurrent({
			id,
			artworkVersions,
		})
		await prisma.$transaction([deleteArtworkVersionsPromise])

		// Step 4: create new artwork version
		const createdArtworkVersion = await createArtworkVersion({ data })
		invariant(createdArtworkVersion, 'New artwork version not created')

		// Step 5: connect created and current versions
		const connectNodesPromise = connectPrevAndNext({
			prevId: currentArtworkVersion.id,
			nextId: createdArtworkVersion.id,
		})
		await prisma.$transaction(connectNodesPromise)

		// Step 6: copy contents of previous artwork version to new artwork version
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

		return { createdArtworkVersion, success: true }
	} catch (error) {
		console.log('designCreateService error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

const deleteArtworkVersionsAfterCurrent = ({
	id,
	artworkVersions,
}: {
	id: IArtworkVersion['id']
	artworkVersions: IArtworkVersion[]
}) => {
	// Step 1: already got all artwork versions for branch
	// (work-around) for async/await and returning prisma promise
	// Step 2: reorder the artwork versions as linked list
	const orderedArtworkVersions =
		orderLinkedItems<IArtworkVersion>(artworkVersions)

	// Step 3: find the index of the current artwork version
	const currentIndex = orderedArtworkVersions.findIndex(
		artworkVersion => artworkVersion.id === id,
	)

	// Step 4: get the id's of the artwork versions after the current index
	const artworkVersionsToDeleteIds = orderedArtworkVersions
		.slice(currentIndex + 1)
		.map(({ id }) => id)

	// Step 5: return the promise that deletes them
	return deleteArtworkVersions({
		ids: artworkVersionsToDeleteIds,
	})
}
