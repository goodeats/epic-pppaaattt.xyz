import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewArtworkVersionSchema } from '#app/schema/artwork-version'
import { ValidateArtworkBranchParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IArtworkBranch } from '../artwork-branch/artwork-branch.server'
import { type IUser } from '../user/user.server'
import { type IArtworkVersion } from './artwork-version.server'

export interface IArtworkVersionCreatedResponse {
	success: boolean
	message?: string
	createdArtworkVersion?: IArtworkVersion
}

export const validateNewArtworkVersionSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkBranchParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: NewArtworkVersionSchema,
		strategy,
	})
}

export const createArtworkVersion = async ({
	data,
}: {
	data: {
		ownerId: IUser['id']
		branchId: IArtworkBranch['id']
		name?: string
		slug?: string
		description?: string
		width?: number
		height?: number
		background?: string
	}
}) => {
	return await prisma.artworkVersion.create({
		data,
	})
}

/**
 * Increment the version string by one.
 * For example, "v0" becomes "v1", "v1" becomes "v2", etc.
 * @param {string} name - The current version string.
 * @returns {string} - The incremented version string.
 */
export const incrementVersionNameString = (name: string): string => {
	// Assuming the prefix is always 'v'
	const versionPrefix = name.slice(0, 1)
	// Get the numeric part of the version
	const versionNumber = parseInt(name.slice(1))
	if (isNaN(versionNumber)) {
		throw new Error(`Invalid version name string: ${name}`)
	}
	// Increment the version number and return the new version string
	return `${versionPrefix}${versionNumber + 1}`
}
