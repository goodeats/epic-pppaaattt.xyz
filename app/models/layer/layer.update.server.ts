import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	EditLayerDescriptionSchema,
	EditLayerNameSchema,
} from '#app/schema/layer'
import { ValidateLayerSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { findFirstLayerInstance } from '#app/utils/prisma-extensions-layer'
import { type ILayer } from '../layer/layer.server'

export interface ILayerUpdatedResponse {
	success: boolean
	message?: string
	updatedLayer?: ILayer
}

export const validateLayerNameSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateLayerSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditLayerNameSchema,
		strategy,
	})
}

export const validateLayerDescriptionSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateLayerSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditLayerDescriptionSchema,
		strategy,
	})
}

const getLayerInstance = async ({ id }: { id: ILayer['id'] }) => {
	return await findFirstLayerInstance({
		where: { id },
	})
}

// updating instance instead of regular prism update
// this may not be easier, but it's more explicit
export const updateLayerName = async ({
	id,
	name,
}: {
	id: ILayer['id']
	name: number
}): Promise<ILayerUpdatedResponse> => {
	const layer = await getLayerInstance({ id })
	if (!layer) return { success: false }

	try {
		const data = EditLayerNameSchema.parse({ id, name })
		layer.name = data.name
		layer.updatedAt = new Date()
		await layer.save()

		return { success: true, updatedLayer: layer }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateLayerName error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateLayerDescription = async ({
	id,
	description,
}: {
	id: ILayer['id']
	description: number
}): Promise<ILayerUpdatedResponse> => {
	const layer = await getLayerInstance({ id })
	if (!layer) return { success: false }

	try {
		const data = EditLayerDescriptionSchema.parse({ id, description })
		layer.description = data.description ?? ''
		layer.updatedAt = new Date()
		await layer.save()

		return { success: true, updatedLayer: layer }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateLayerDescription error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
