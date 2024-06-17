import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type ILayer } from '#app/models/layer/layer.server'
import { NewAssetImageLayerSchema } from '#app/schema/asset/image.layer'
import { ValidateLayerParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntityImageSubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import {
	type IAssetImageCreateData,
	type IAssetImageCreateSubmission,
} from './image.create.server'
import { stringifyAssetImageAttributes } from './utils'

export const validateNewAssetImageLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateLayerParentSubmissionStrategy()

	return await validateEntityImageSubmission({
		userId,
		formData,
		schema: NewAssetImageLayerSchema,
		strategy,
	})
}

export interface IAssetImageLayerCreateSubmission
	extends IAssetImageCreateSubmission {
	layerId: ILayer['id']
}

interface IAssetImageLayerCreateData extends IAssetImageCreateData {
	layerId: ILayer['id']
}

export const createAssetImageLayer = ({
	data,
}: {
	data: IAssetImageLayerCreateData
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
