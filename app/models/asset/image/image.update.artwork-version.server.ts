import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import {
	EditAssetImageArtworkVersionSchema,
	EditVisibleAssetImageArtworkVersionSchema,
} from '#app/schema/asset/image.artwork-version'
import { ValidateAssetSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import {
	validateEntityImageSubmission,
	validateEntitySubmission,
} from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IAssetImage } from './image.server'
import {
	type IAssetImageUpdateData,
	type IAssetImageUpdateSubmission,
} from './image.update.server'
import { stringifyAssetImageAttributes } from './utils'

export const validateEditAssetImageArtworkVersionSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateAssetSubmissionStrategy()

	return await validateEntityImageSubmission({
		userId,
		formData,
		schema: EditAssetImageArtworkVersionSchema,
		strategy,
	})
}

export const validateEditVisibleAssetImageArtworkVersionSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateAssetSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditVisibleAssetImageArtworkVersionSchema,
		strategy,
	})
}

export interface IAssetImageArtworkVersionUpdateSubmission
	extends IAssetImageUpdateSubmission {
	artworkVersionId: IArtworkVersion['id']
}

interface IAssetImageArtworkVersionUpdateData extends IAssetImageUpdateData {
	artworkVersionId: IArtworkVersion['id']
}

export const updateAssetImageArtworkVersion = ({
	id,
	data,
}: {
	id: IAssetImage['id']
	data: IAssetImageArtworkVersionUpdateData
}) => {
	const { attributes, ...rest } = data
	const jsonAttributes = stringifyAssetImageAttributes(attributes)
	return prisma.asset.update({
		where: { id },
		data: {
			...rest,
			attributes: jsonAttributes,
		},
	})
}
