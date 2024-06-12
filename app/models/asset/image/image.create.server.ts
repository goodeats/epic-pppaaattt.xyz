import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { type AssetTypeEnum } from '#app/schema/asset'
import { NewAssetImageArtworkSchema } from '#app/schema/asset/image'
import { ValidateArtworkParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { stringifyAssetImageAttributes } from '#app/utils/asset/image'
import { validateEntityImageSubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IAssetCreateData, type IAsset } from '../asset.server'
import {
	type IAssetImageSubmission,
	type IAssetAttributesImage,
} from './image.server'

export interface IAssetImageCreatedResponse {
	success: boolean
	message?: string
	createdAssetImage?: IAsset
}

export const validateNewAssetImageArtworkSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkParentSubmissionStrategy()

	return await validateEntityImageSubmission({
		userId,
		formData,
		schema: NewAssetImageArtworkSchema,
		strategy,
	})
}

export interface IAssetImageCreateSubmission extends IAssetImageSubmission {
	blob: Buffer
}

export interface IAssetImageArtworkCreateSubmission
	extends IAssetImageCreateSubmission {
	artworkId: IArtwork['id']
}

interface IAssetImageCreateData extends IAssetCreateData {
	type: typeof AssetTypeEnum.IMAGE
	attributes: IAssetAttributesImage
	blob: Buffer
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
