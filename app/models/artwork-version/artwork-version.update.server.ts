import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	ArtworkVersionWidthSchema,
	type ArtworkVersionUpdateSchemaType,
	ArtworkVersionHeightSchema,
	ArtworkVersionBackgroundSchema,
	ArtworkVersionStarredSchema,
	ArtworkVersionPublishedSchema,
	ArtworkVersionWatermarkSchema,
	ArtworkVersionWatermarkColorSchema,
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

export async function validateArtworkVersionStarredSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: ArtworkVersionStarredSchema,
	})
}

export async function validateArtworkVersionPublishedSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: ArtworkVersionPublishedSchema,
	})
}

export async function validateArtworkVersionWatermarkSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: ArtworkVersionWatermarkSchema,
	})
}

export async function validateArtworkVersionWatermarkColorSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: ArtworkVersionWatermarkColorSchema,
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

// unstarring should also unpublish
export const updateArtworkVersionStarred = async ({
	id,
}: {
	id: IArtworkVersion['id']
}) => {
	const artworkVersion = await getArtworkVersionInstance({ id })
	if (!artworkVersion) return { success: false }

	try {
		const isUnstarring = !artworkVersion.starred
		artworkVersion.starred = isUnstarring
		if (isUnstarring) {
			artworkVersion.published = false
			artworkVersion.publishedAt = null
		}
		artworkVersion.updatedAt = new Date()
		await artworkVersion.save()

		return { success: true }
	} catch (error) {
		// consider how to handle this error where this is called
		console.error(error)
		return { success: false }
	}
}

// unpublishing should not impact starred status
export const updateArtworkVersionPublished = async ({
	id,
}: {
	id: IArtworkVersion['id']
}) => {
	const artworkVersion = await getArtworkVersionInstance({ id })
	if (!artworkVersion) return { success: false }

	try {
		const isPublishing = !artworkVersion.published
		artworkVersion.published = isPublishing
		artworkVersion.publishedAt = isPublishing ? new Date() : null
		artworkVersion.updatedAt = new Date()
		await artworkVersion.save()

		return { success: true }
	} catch (error) {
		// consider how to handle this error where this is called
		console.error(error)
		return { success: false }
	}
}

export const updateArtworkVersionWatermark = async ({
	id,
}: {
	id: IArtworkVersion['id']
}) => {
	const artworkVersion = await getArtworkVersionInstance({ id })
	if (!artworkVersion) return { success: false }

	try {
		artworkVersion.watermark = !artworkVersion.watermark
		artworkVersion.updatedAt = new Date()
		await artworkVersion.save()

		return { success: true }
	} catch (error) {
		// consider how to handle this error where this is called
		console.error(error)
		return { success: false }
	}
}

export const updateArtworkVersionWatermarkColor = async ({
	id,
	watermarkColor,
}: {
	id: IArtworkVersion['id']
	watermarkColor: string
}) => {
	const artworkVersion = await getArtworkVersionInstance({ id })
	if (!artworkVersion) return { success: false }

	try {
		const data = ArtworkVersionWatermarkColorSchema.parse({
			id,
			watermarkColor,
		})
		artworkVersion.watermarkColor = data.watermarkColor
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
