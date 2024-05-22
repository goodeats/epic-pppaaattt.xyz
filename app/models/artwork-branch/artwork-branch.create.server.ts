import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewArtworkBranchSchema } from '#app/schema/artwork-branch'
import { ValidateArtworkParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IArtwork } from '../artwork/artwork.server'
import { type IUser } from '../user/user.server'
import {
	type IArtworkBranch,
	type IArtworkBranchWithVersions,
} from './artwork-branch.server'

export interface IArtworkBranchCreatedResponse {
	success: boolean
	message?: string
	createdArtworkBranch?: IArtworkBranch
}

export const validateNewArtworkBranchSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: NewArtworkBranchSchema,
		strategy,
	})
}

export const createArtworkBranch = async ({
	data,
}: {
	data: {
		ownerId: IUser['id']
		artworkId: IArtwork['id']
		parentId?: IArtworkBranch['id']
		name: string
		slug: string
		description: string | null | undefined
	}
}) => {
	const artworkBranch = await prisma.artworkBranch.create({
		data,
	})
	return artworkBranch
}

export const createDefaultArtworkBranchWithVersion = async ({
	artwork,
}: {
	artwork: Pick<IArtwork, 'id' | 'ownerId'>
}): Promise<IArtworkBranchWithVersions> => {
	const { ownerId } = artwork

	const artworkBranch = await prisma.artworkBranch.create({
		data: {
			artwork: {
				connect: {
					id: artwork.id,
				},
			},
			owner: {
				connect: {
					id: ownerId,
				},
			},
			default: true,
			versions: {
				create: {
					owner: {
						connect: {
							id: ownerId,
						},
					},
				},
			},
		},
		include: {
			versions: true,
		},
	})
	return artworkBranch
}
