import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { NewAssetImageArtworkVersionSchema } from '#app/schema/asset/image.artwork-version'
import { ValidateArtworkVersionParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntityImageSubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import {
	type IAssetImageCreateData,
	type IAssetImageCreateSubmission,
} from './image.create.server'
import { stringifyAssetImageAttributes } from './utils'

export const validateNewAssetImageArtworkVersionSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkVersionParentSubmissionStrategy()

	return await validateEntityImageSubmission({
		userId,
		formData,
		schema: NewAssetImageArtworkVersionSchema,
		strategy,
	})
}

export interface IAssetImageArtworkVersionCreateSubmission
	extends IAssetImageCreateSubmission {
	artworkVersionId: IArtworkVersion['id']
}

interface IAssetImageArtworkVersionCreateData extends IAssetImageCreateData {
	artworkVersionId: IArtworkVersion['id']
}

export const createAssetImageArtworkVersion = ({
	data,
}: {
	data: IAssetImageArtworkVersionCreateData
}) => {
	const { attributes, ...rest } = data
	const jsonAttributes = stringifyAssetImageAttributes(attributes)
	return prisma.asset.create({
		data: {
			...rest,
			attributes: jsonAttributes,
		},
	})
}
