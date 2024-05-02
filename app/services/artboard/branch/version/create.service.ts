import { invariant } from '@epic-web/invariant'
import { type User } from '@prisma/client'
import { type IArtboardBranch } from '#app/models/artboard-branch/artboard-branch.server'
import {
	type IArtboardVersionCreatedResponse,
	incrementVersionNameString,
	createArtboardVersion,
} from '#app/models/artboard-version/artboard-version.create.server'
import { deleteArtboardVersions } from '#app/models/artboard-version/artboard-version.delete.server'
import {
	getArtboardVersion,
	getArtboardVersions,
} from '#app/models/artboard-version/artboard-version.get.server'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { connectPrevAndNext } from '#app/models/artboard-version/artboard-version.update.server'
import { ArtboardVersionDataCreateSchema } from '#app/schema/artboard-version'
import { DesignCloneSourceTypeEnum } from '#app/schema/design'
import { LayerCloneSourceTypeEnum } from '#app/schema/layer'
import { prisma } from '#app/utils/db.server'
import { orderLinkedItems } from '#app/utils/linked-list.utils'
import { artboardVersionCloneDesignsService } from '../../version/clone-designs.service'
import { artboardVersionCloneLayersService } from '../../version/clone-layers.service'

// copy contents of previous artboard version to new artboard version

export const artboardVersionCreateService = async ({
	userId,
	id,
	artboardBranchId,
	description,
}: {
	userId: User['id']
	id: IArtboardVersion['id']
	artboardBranchId: IArtboardBranch['id']
	description: string
}): Promise<IArtboardVersionCreatedResponse> => {
	try {
		// Step 1: find the current artboard version
		// this could be the tail
		// or this could be an earlier version where the version history is being reset
		// aka undo, undo, undo, new version edits
		const currentArtboardVersion = await getArtboardVersion({
			where: { id, ownerId: userId },
		})
		invariant(currentArtboardVersion, 'Current artboard version not found')

		// Step 2: get data for new artboard version
		const { name, width, height, background } = currentArtboardVersion
		const newName = incrementVersionNameString(name)
		const data = ArtboardVersionDataCreateSchema.parse({
			ownerId: userId,
			branchId: artboardBranchId,
			name: newName,
			slug: newName,
			description,
			width,
			height,
			background,
		})

		// Step 3: create new artboard version
		const createdArtboardVersion = await createArtboardVersion({ data })
		invariant(createdArtboardVersion, 'New artboard version not created')

		// Step 4: delete all artboard versions after the current artboard version
		const artboardVersions = await getArtboardVersions({
			where: { branchId: artboardBranchId },
		})
		const deleteArtboardVersionsPromise = deleteArtboardVersionsAfterCurrent({
			id,
			artboardVersions,
		})
		await prisma.$transaction([deleteArtboardVersionsPromise])

		// Step 5: connect created and current versions
		const connectNodesPromise = connectPrevAndNext({
			prevId: currentArtboardVersion.id,
			nextId: createdArtboardVersion.id,
		})
		await prisma.$transaction(connectNodesPromise)

		// Step 6: copy contents of previous artboard version to new artboard version
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

		return { createdArtboardVersion, success: true }
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

const deleteArtboardVersionsAfterCurrent = ({
	id,
	artboardVersions,
}: {
	id: IArtboardVersion['id']
	artboardVersions: IArtboardVersion[]
}) => {
	// Step 1: already got all artboard versions for branch
	// (work-around) for async/await and returning prisma promise
	// Step 2: reorder the artboard versions as linked list
	const orderedArtboardVersions =
		orderLinkedItems<IArtboardVersion>(artboardVersions)

	// Step 3: find the index of the current artboard version
	const currentIndex = orderedArtboardVersions.findIndex(
		artboardVersion => artboardVersion.id === id,
	)

	// Step 4: get the id's of the artboard versions after the current index
	const artboardVersionsToDeleteIds = orderedArtboardVersions
		.slice(currentIndex + 1)
		.map(({ id }) => id)

	// Step 5: return the promise that deletes them
	return deleteArtboardVersions({
		ids: artboardVersionsToDeleteIds,
	})
}
