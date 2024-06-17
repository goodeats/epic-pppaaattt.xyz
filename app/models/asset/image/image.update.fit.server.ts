import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IUser } from '#app/models/user/user.server'
import { EditAssetImageFitSchema } from '#app/schema/asset/image'
import { ValidateAssetSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import {
	type IAssetImageFit,
	type IAssetImage,
	type IAssetAttributesImage,
} from './image.server'
import { stringifyAssetImageAttributes } from './utils'

export const validateEditFitAssetImageSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateAssetSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditAssetImageFitSchema,
		strategy,
	})
}

export interface IAssetImageUpdateFitSubmission {
	userId: IUser['id']
	id: IAssetImage['id']
	fit: IAssetImageFit
}

interface IAssetImageUpdateFitData {
	attributes: IAssetAttributesImage
}

export const updateAssetImageFit = ({
	id,
	data,
}: {
	id: IAssetImage['id']
	data: IAssetImageUpdateFitData
}) => {
	const { attributes } = data
	const jsonAttributes = stringifyAssetImageAttributes(attributes)
	return prisma.asset.update({
		where: { id },
		data: {
			attributes: jsonAttributes,
		},
	})
}
