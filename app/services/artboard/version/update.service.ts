import { type z } from 'zod'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import {
	ArtboardVersionWidthSchema,
	ArtboardVersionBackgroundSchema,
	ArtboardVersionHeightSchema,
} from '#app/schema/artboard-version'
import { ValidateArtboardVersionSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import {
	submissionErrorResponse,
	validateEntitySubmission,
} from '#app/utils/conform-utils'
import { findFirstArtboardVersionInstance } from '#app/utils/prisma-extensions-artboard-version'
import { updateProperty } from '#app/utils/typescript-helpers'

// strategy pattern function
const getArtboardVersion = async ({ id }: { id: IArtboardVersion['id'] }) => {
	return await findFirstArtboardVersionInstance({
		where: { id },
	})
}

export async function updateArtboardVersionProperty({
	userId,
	formData,
	propertySchema,
	propertyName,
}: IntentActionArgs & {
	propertySchema: z.ZodSchema<any>
	propertyName: keyof IArtboardVersion
}) {
	const strategy = new ValidateArtboardVersionSubmissionStrategy()

	const { submission, isValid, response } = await validateEntitySubmission({
		userId,
		formData,
		schema: propertySchema,
		strategy,
	})
	if (!isValid || !submission) return response

	// make changes if response is success
	const artboardVersion = await getArtboardVersion({ id: submission.value.id })
	if (!artboardVersion) return submissionErrorResponse(submission)

	updateProperty(artboardVersion, propertyName, submission.value[propertyName])
	artboardVersion.updatedAt = new Date()
	await artboardVersion.save()

	return response
}

export async function updateArtboardVersionWidthService(
	args: IntentActionArgs,
) {
	return updateArtboardVersionProperty({
		...args,
		propertySchema: ArtboardVersionWidthSchema,
		propertyName: 'width',
	})
}

export async function updateArtboardVersionHeightService(
	args: IntentActionArgs,
) {
	return updateArtboardVersionProperty({
		...args,
		propertySchema: ArtboardVersionHeightSchema,
		propertyName: 'height',
	})
}

export async function updateArtboardVersionBackgroundService(
	args: IntentActionArgs,
) {
	return updateArtboardVersionProperty({
		...args,
		propertySchema: ArtboardVersionBackgroundSchema,
		propertyName: 'background',
	})
}
