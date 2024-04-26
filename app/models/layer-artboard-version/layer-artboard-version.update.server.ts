import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	ReorderArtboardVersionLayerSchema,
	SelectArtboardVersionLayerSchema,
	ToggleVisibleArtboardVersionLayerSchema,
} from '#app/schema/layer-artboard-version'
import { ValidateArtboardVersionParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { prisma } from '#app/utils/db.server'
import { type IArtboardVersion } from '../artboard-version/artboard-version.server'
import { type ILayer } from '../layer.server'

export const validateArtboardVersionToggleVisibeLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtboardVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: ToggleVisibleArtboardVersionLayerSchema,
		strategy,
	})
}

export const validateArtboardVersionReorderLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtboardVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: ReorderArtboardVersionLayerSchema,
		strategy,
	})
}

export const validateArtboardVersionSelectLayerSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateArtboardVersionParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: SelectArtboardVersionLayerSchema,
		strategy,
	})
}

export const deselectArtboardVersionLayers = ({
	artboardVersionId,
}: {
	artboardVersionId: IArtboardVersion['id']
}) => {
	return prisma.layer.updateMany({
		where: { artboardVersionId },
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
