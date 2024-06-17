import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type ILayer } from '#app/models/layer/layer.server'
import { type IUser } from '#app/models/user/user.server'
import { EditVisibleAssetImageLayerSchema } from '#app/schema/asset/image.layer'
import { ValidateAssetSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IAssetImage } from './image.server'

export const validateEditVisibleAssetImageLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateAssetSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditVisibleAssetImageLayerSchema,
		strategy,
	})
}

export interface IAssetImageLayerUpdateVisibleSubmission {
	id: IAssetImage['id']
	userId: IUser['id']
	layerId: ILayer['id']
}

interface IAssetImageLayerUpdateVisibleData {
	visible: boolean
}

export const updateAssetImageLayerVisible = ({
	id,
	data,
}: {
	id: IAssetImage['id']
	data: IAssetImageLayerUpdateVisibleData
}) => {
	return prisma.asset.update({
		where: { id },
		data,
	})
}
