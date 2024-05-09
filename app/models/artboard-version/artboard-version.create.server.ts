import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewArtboardVersionSchema } from '#app/schema/artboard-version'
import { ValidateArtboardBranchParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IArtboardBranch } from '../artboard-branch/artboard-branch.server'
import { type IUser } from '../user/user.server'
import { type IArtboardVersion } from './artboard-version.server'

export interface IArtboardVersionCreatedResponse {
	success: boolean
	message?: string
	createdArtboardVersion?: IArtboardVersion
}

export const validateNewArtboardVersionSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtboardBranchParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: NewArtboardVersionSchema,
		strategy,
	})
}

export const createArtboardVersion = async ({
	data,
}: {
	data: {
		ownerId: IUser['id']
		branchId: IArtboardBranch['id']
		name?: string
		slug?: string
		description?: string
		width?: number
		height?: number
		background?: string
	}
}) => {
	return await prisma.artboardVersion.create({
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
