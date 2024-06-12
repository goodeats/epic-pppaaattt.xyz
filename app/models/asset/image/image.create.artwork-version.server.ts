import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { NewAssetImageArtworkSchema } from '#app/schema/asset/image.artwork'
import { ValidateArtworkVersionParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntityImageSubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import {
	type IAssetImageCreateData,
	type IAssetImageCreateSubmission,
} from './image.create.server'
import { stringifyAssetImageAttributes } from './utils'

export const validateNewAssetImageArtworkSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkVersionParentSubmissionStrategy()

	return await validateEntityImageSubmission({
		userId,
		formData,
		schema: NewAssetImageArtworkSchema,
		strategy,
	})
}

export interface IAssetImageArtworkCreateSubmission
	extends IAssetImageCreateSubmission {
	artworkId: IArtwork['id']
}

interface IAssetImageArtworkCreateData extends IAssetImageCreateData {
	artworkId: IArtwork['id']
}

export const createAssetImageArtwork = ({
	data,
}: {
	data: IAssetImageArtworkCreateData
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
