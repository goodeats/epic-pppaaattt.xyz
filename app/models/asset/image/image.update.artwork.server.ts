import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { EditAssetImageArtworkSchema } from '#app/schema/asset/image.artwork'
import { ValidateAssetSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntityImageSubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IAssetImage } from './image.server'
import {
	type IAssetImageUpdateData,
	type IAssetImageUpdateSubmission,
} from './image.update.server'
import { stringifyAssetImageAttributes } from './utils'

export const validateEditAssetImageArtworkSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateAssetSubmissionStrategy()

	return await validateEntityImageSubmission({
		userId,
		formData,
		schema: EditAssetImageArtworkSchema,
		strategy,
	})
}

export interface IAssetImageArtworkUpdateSubmission
	extends IAssetImageUpdateSubmission {
	artworkId: IArtwork['id']
}

interface IAssetImageArtworkUpdateData extends IAssetImageUpdateData {
	artworkId: IArtwork['id']
}

export const updateAssetImageArtwork = ({
	id,
	data,
}: {
	id: IAssetImage['id']
	data: IAssetImageArtworkUpdateData
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
