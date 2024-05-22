import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { NewArtworkVersionLayerSchema } from '#app/schema/layer-artwork-version'
import { ValidateArtworkVersionParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IArtwork } from '../artwork/artwork.server'
import { type IArtworkVersion } from '../artwork-version/artwork-version.server'
import { type ILayer } from '../layer/layer.server'
import { type IUser } from '../user/user.server'

export interface ILayerCreatedResponse {
	success: boolean
	message?: string
	createdLayer?: ILayer
}

export const validateArtworkVersionNewLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: NewArtworkVersionLayerSchema,
		strategy,
	})
}

export const createLayer = async ({
	data,
}: {
	data: {
		ownerId: IUser['id']
		name: string
		artworkId?: IArtwork['id']
		artworkVersionId?: IArtworkVersion['id']
		description?: string | undefined
		slug?: string | undefined
		visible?: boolean
	}
}): Promise<ILayer> => {
	return await prisma.layer.create({ data })
}
