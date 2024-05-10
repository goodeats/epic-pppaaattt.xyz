import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewArtboardBranchSchema } from '#app/schema/artboard-branch'
import { ValidateArtboardParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IArtboard } from '../artboard/artboard.server'
import { type IUser } from '../user/user.server'
import {
	type IArtboardBranch,
	type IArtboardBranchWithVersions,
} from './artboard-branch.server'

export interface IArtboardBranchCreatedResponse {
	success: boolean
	message?: string
	createdArtboardBranch?: IArtboardBranch
}

export const validateNewArtboardBranchSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtboardParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: NewArtboardBranchSchema,
		strategy,
	})
}

export const createArtboardBranch = async ({
	data,
}: {
	data: {
		ownerId: IUser['id']
		artboardId: IArtboard['id']
		parentId?: IArtboardBranch['id']
		name: string
		slug: string
		description: string | null | undefined
	}
}) => {
	const artboardBranch = await prisma.artboardBranch.create({
		data,
	})
	return artboardBranch
}

export const createDefaultArtboardBranchWithVersion = async ({
	artboard,
}: {
	artboard: Pick<IArtboard, 'id' | 'ownerId'>
}): Promise<IArtboardBranchWithVersions> => {
	const { ownerId } = artboard

	const artboardBranch = await prisma.artboardBranch.create({
		data: {
			artboard: {
				connect: {
					id: artboard.id,
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
	return artboardBranch
}
