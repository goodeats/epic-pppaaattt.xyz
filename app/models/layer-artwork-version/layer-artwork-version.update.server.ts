import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	ReorderArtworkVersionLayerSchema,
	SelectArtworkVersionLayerSchema,
	ToggleVisibleArtworkVersionLayerSchema,
} from '#app/schema/layer-artwork-version'
import { ValidateArtworkVersionParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IArtworkVersion } from '../artwork-version/artwork-version.server'
import { type ILayer } from '../layer/layer.server'

export const validateArtworkVersionToggleVisibeLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: ToggleVisibleArtworkVersionLayerSchema,
		strategy,
	})
}

export const validateArtworkVersionReorderLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: ReorderArtworkVersionLayerSchema,
		strategy,
	})
}

export const validateArtworkVersionSelectLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtworkVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: SelectArtworkVersionLayerSchema,
		strategy,
	})
}

export const deselectArtworkVersionLayers = ({
	artworkVersionId,
}: {
	artworkVersionId: IArtworkVersion['id']
}) => {
	return prisma.layer.updateMany({
		where: { artworkVersionId },
		data: { selected: false },
	})
}

export const updateLayerSelected = ({
	id,
	selected,
}: {
	id: ILayer['id']
	selected: boolean
}) => {
	return prisma.layer.update({
		where: { id },
		data: { selected },
	})
}
