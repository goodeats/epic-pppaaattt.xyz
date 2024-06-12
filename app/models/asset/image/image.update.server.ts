import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { EditAssetImageArtworkSchema } from '#app/schema/asset/image'
import { ValidateAssetSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { stringifyAssetImageAttributes } from '#app/utils/asset/image'
import { validateEntityImageSubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IAssetUpdateData, type IAsset } from '../asset.server'
import {
	type IAssetImageSubmission,
	type IAssetAttributesImage,
	type IAssetImage,
} from './image.server'

export interface IAssetImageUpdatedResponse {
	success: boolean
	message?: string
	updatedAssetImage?: IAsset
}

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

export interface IAssetImageUpdateSubmission extends IAssetImageSubmission {
	id: IAssetImage['id']
	blob?: Buffer
}

export interface IAssetImageArtworkUpdateSubmission
	extends IAssetImageUpdateSubmission {
	artworkId: IArtwork['id']
}

interface IAssetImageUpdateData extends IAssetUpdateData {
	attributes: IAssetAttributesImage
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
