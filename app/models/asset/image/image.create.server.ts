import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { type IUser } from '#app/models/user/user.server'
import { type AssetTypeEnum } from '#app/schema/asset'
import { NewAssetImageArtworkSchema } from '#app/schema/asset/image'
import { ValidateArtworkParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntityImageSubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IAsset } from '../asset.server'

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

export const createAssetImageArtwork = ({
	data,
}: {
	data: {
		ownerId: IUser['id']
		artworkId: IArtwork['id']
		name: string
		description?: string
		type: typeof AssetTypeEnum.IMAGE
		attributes: {
			contentType: string
			altText?: string
		}
		blob: Buffer
	}
}) => {
	const { attributes, ...rest } = data
	const jsonAttributes = JSON.stringify(attributes)
	console.log('about to create...', jsonAttributes)
	return prisma.asset.create({
		data: {
			...rest,
			attributes: jsonAttributes,
		},
	})
}
