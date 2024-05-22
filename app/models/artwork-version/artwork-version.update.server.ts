import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	ArtworkVersionWidthSchema,
	type ArtworkVersionUpdateSchemaType,
	ArtworkVersionHeightSchema,
	ArtworkVersionBackgroundSchema,
} from '#app/schema/artwork-version'
import { ValidateArtworkVersionSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { findFirstArtworkVersionInstance } from '#app/utils/prisma-extensions-artwork-version'
import { type IArtworkVersion } from './artwork-version.server'

const validateUpdateSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & {
	schema: ArtworkVersionUpdateSchemaType
}) => {
	const strategy = new ValidateArtworkVersionSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}

export async function validateArtworkVersionWidthSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: ArtworkVersionWidthSchema,
	})
}

export async function validateArtworkVersionHeightSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: ArtworkVersionHeightSchema,
	})
}

export async function validateArtworkVersionBackgroundSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: ArtworkVersionBackgroundSchema,
	})
}

const getArtworkVersionInstance = async ({
	id,
}: {
	id: IArtworkVersion['id']
}) => {
	return await findFirstArtworkVersionInstance({
		where: { id },
	})
}

// updating instance instead of regular prism update
// this may not be easier, but it's more explicit
export const updateArtworkVersionWidth = async ({
	id,
	width,
}: {
	id: IArtworkVersion['id']
	width: number
}) => {
	const artworkVersion = await getArtworkVersionInstance({ id })
	if (!artworkVersion) return { success: false }

	try {
		const data = ArtworkVersionWidthSchema.parse({ id, width })
		artworkVersion.width = data.width
		artworkVersion.updatedAt = new Date()
		await artworkVersion.save()

		return { success: true }
	} catch (error) {
		// consider how to handle this error where this is called
		console.error(error)
		return { success: false }
	}
}

export const updateArtworkVersionHeight = async ({
	id,
	height,
}: {
	id: IArtworkVersion['id']
	height: number
}) => {
	const artworkVersion = await getArtworkVersionInstance({ id })
	if (!artworkVersion) return { success: false }

	try {
		const data = ArtworkVersionHeightSchema.parse({ id, height })
		artworkVersion.height = data.height
		artworkVersion.updatedAt = new Date()
		await artworkVersion.save()

		return { success: true }
	} catch (error) {
		// consider how to handle this error where this is called
		console.error(error)
		return { success: false }
	}
}

export const updateArtworkVersionBackground = async ({
	id,
	background,
}: {
	id: IArtworkVersion['id']
	background: string
}) => {
	const artworkVersion = await getArtworkVersionInstance({ id })
	if (!artworkVersion) return { success: false }

	try {
		console.log('background', background)
		const data = ArtworkVersionBackgroundSchema.parse({ id, background })
		artworkVersion.background = data.background
		artworkVersion.updatedAt = new Date()
		await artworkVersion.save()

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
	prevId: IArtworkVersion['id']
	nextId: IArtworkVersion['id']
}) => {
	const connectNextToPrev = prisma.artworkVersion.update({
		where: { id: prevId },
		data: { nextId },
	})
	const connectPrevToNext = prisma.artworkVersion.update({
		where: { id: nextId },
		data: { prevId },
	})
	return [connectNextToPrev, connectPrevToNext]
}
