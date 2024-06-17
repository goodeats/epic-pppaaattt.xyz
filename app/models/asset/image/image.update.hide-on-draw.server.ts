import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IUser } from '#app/models/user/user.server'
import { EditAssetImageHideOnDrawSchema } from '#app/schema/asset/image'
import { ValidateAssetSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IAssetImage, type IAssetImageFileData } from './image.server'
import { stringifyAssetImageAttributes } from './utils'

export const validateEditHideOnDrawAssetImageSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateAssetSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditAssetImageHideOnDrawSchema,
		strategy,
	})
}

export interface IAssetImageUpdateHideOnDrawSubmission {
	userId: IUser['id']
	id: IAssetImage['id']
	hideOnDraw: boolean
}

interface IAssetImageUpdateHideOnDrawData {
	attributes: IAssetImageFileData
}

export const updateAssetImageHideOnDraw = ({
	id,
	data,
}: {
	id: IAssetImage['id']
	data: IAssetImageUpdateHideOnDrawData
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
