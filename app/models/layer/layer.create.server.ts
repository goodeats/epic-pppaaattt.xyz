import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewArtboardVersionLayerSchema } from '#app/schema/layer-artboard-version'
import { ValidateArtboardVersionParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IArtboard } from '../artboard/artboard.server'
import { type IArtboardVersion } from '../artboard-version/artboard-version.server'
import { type ILayer } from '../layer.server'
import { type IUser } from '../user/user.server'

export interface ILayerCreatedResponse {
	success: boolean
	message?: string
	createdLayer?: ILayer
}

export const validateArtboardVersionNewLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtboardVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: NewArtboardVersionLayerSchema,
		strategy,
	})
}

export const createLayer = async ({
	data,
}: {
	data: {
		ownerId: IUser['id']
		name: string
		artboardId?: IArtboard['id']
		artboardVersionId?: IArtboardVersion['id']
		description?: string | undefined
		slug?: string | undefined
		visible?: boolean
	}
}): Promise<ILayer> => {
	return await prisma.layer.create({ data })
}
