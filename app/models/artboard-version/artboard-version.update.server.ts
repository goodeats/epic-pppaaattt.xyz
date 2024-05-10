import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	ArtboardVersionWidthSchema,
	type ArtboardVersionUpdateSchemaType,
	ArtboardVersionHeightSchema,
	ArtboardVersionBackgroundSchema,
} from '#app/schema/artboard-version'
import { ValidateArtboardVersionSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { findFirstArtboardVersionInstance } from '#app/utils/prisma-extensions-artboard-version'
import { type IArtboardVersion } from './artboard-version.server'

const validateUpdateSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & {
	schema: ArtboardVersionUpdateSchemaType
}) => {
	const strategy = new ValidateArtboardVersionSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}

export async function validateArtboardVersionWidthSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: ArtboardVersionWidthSchema,
	})
}

export async function validateArtboardVersionHeightSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: ArtboardVersionHeightSchema,
	})
}

export async function validateArtboardVersionBackgroundSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: ArtboardVersionBackgroundSchema,
	})
}

const getArtboardVersionInstance = async ({
	id,
}: {
	id: IArtboardVersion['id']
}) => {
	return await findFirstArtboardVersionInstance({
		where: { id },
	})
}

// updating instance instead of regular prism update
// this may not be easier, but it's more explicit
export const updateArtboardVersionWidth = async ({
	id,
	width,
}: {
	id: IArtboardVersion['id']
	width: number
}) => {
	const artboardVersion = await getArtboardVersionInstance({ id })
	if (!artboardVersion) return { success: false }

	try {
		const data = ArtboardVersionWidthSchema.parse({ id, width })
		artboardVersion.width = data.width
		artboardVersion.updatedAt = new Date()
		await artboardVersion.save()

		return { success: true }
	} catch (error) {
		// consider how to handle this error where this is called
		console.error(error)
		return { success: false }
	}
}

export const updateArtboardVersionHeight = async ({
	id,
	height,
}: {
	id: IArtboardVersion['id']
	height: number
}) => {
	const artboardVersion = await getArtboardVersionInstance({ id })
	if (!artboardVersion) return { success: false }

	try {
		const data = ArtboardVersionHeightSchema.parse({ id, height })
		artboardVersion.height = data.height
		artboardVersion.updatedAt = new Date()
		await artboardVersion.save()

		return { success: true }
	} catch (error) {
		// consider how to handle this error where this is called
		console.error(error)
		return { success: false }
	}
}

export const updateArtboardVersionBackground = async ({
	id,
	background,
}: {
	id: IArtboardVersion['id']
	background: string
}) => {
	const artboardVersion = await getArtboardVersionInstance({ id })
	if (!artboardVersion) return { success: false }

	try {
		console.log('background', background)
		const data = ArtboardVersionBackgroundSchema.parse({ id, background })
		artboardVersion.background = data.background
		artboardVersion.updatedAt = new Date()
		await artboardVersion.save()

		return { success: true }
	} catch (error) {
		// consider how to handle this error where this is called
		console.error(error)
		return { success: false }
	}
}

export const connectPrevAndNext = ({
	prevId,
	nextId,
}: {
	prevId: IArtboardVersion['id']
	nextId: IArtboardVersion['id']
}) => {
	const connectNextToPrev = prisma.artboardVersion.update({
		where: { id: prevId },
		data: { nextId },
	})
	const connectPrevToNext = prisma.artboardVersion.update({
		where: { id: nextId },
		data: { prevId },
	})
	return [connectNextToPrev, connectPrevToNext]
}
