import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type IUser } from '#app/models/user/user.server'
import { EditVisibleAssetImageArtworkVersionSchema } from '#app/schema/asset/image.artwork-version'
import { ValidateAssetSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IAssetImage } from './image.server'

export const validateEditVisibleAssetImageArtworkVersionSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateAssetSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditVisibleAssetImageArtworkVersionSchema,
		strategy,
	})
}

export interface IAssetImageArtworkVersionUpdateVisibleSubmission {
	id: IAssetImage['id']
	userId: IUser['id']
	artworkVersionId: IArtworkVersion['id']
}

interface IAssetImageArtworkVersionUpdateVisibleData {
	visible: boolean
}

export const updateAssetImageArtworkVersionVisible = ({
	id,
	data,
}: {
	id: IAssetImage['id']
	data: IAssetImageArtworkVersionUpdateVisibleData
}) => {
	return prisma.asset.update({
		where: { id },
		data,
	})
}
