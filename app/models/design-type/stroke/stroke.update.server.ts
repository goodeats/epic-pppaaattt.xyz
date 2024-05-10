import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	EditDesignStrokeValueSchema,
	type DesignStrokeUpdateSchemaType,
	EditDesignStrokeBasisSchema,
	EditDesignStrokeStyleSchema,
} from '#app/schema/stroke'
import { ValidateDesignParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { findFirstStrokeInstance } from '#app/utils/prisma-extensions-stroke'
import { type IDesign } from '../../design/design.server'
import { type IStroke } from './stroke.server'

export interface IDesignTypeStrokeUpdatedResponse {
	success: boolean
	message?: string
	updatedStroke?: IStroke
}

const validateUpdateSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & {
	schema: DesignStrokeUpdateSchemaType
}) => {
	const strategy = new ValidateDesignParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}

export async function validateDesignTypeUpdateStrokeValueSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignStrokeValueSchema,
	})
}

export async function validateDesignTypeUpdateStrokeBasisSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignStrokeBasisSchema,
	})
}

export async function validateDesignTypeUpdateStrokeStyleSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignStrokeStyleSchema,
	})
}

const getStrokeInstance = async ({ id }: { id: IStroke['id'] }) => {
	return await findFirstStrokeInstance({
		where: { id },
	})
}

// updating instance instead of regular prism update
// this may not be easier, but it's more explicit
export const updateDesignTypeStrokeValue = async ({
	id,
	designId,
	value,
}: {
	id: IStroke['id']
	designId: IDesign['id']
	value: number
}): Promise<IDesignTypeStrokeUpdatedResponse> => {
	const stroke = await getStrokeInstance({ id })
	if (!stroke) return { success: false }

	try {
		const data = EditDesignStrokeValueSchema.parse({ id, designId, value })
		stroke.value = data.value
		stroke.updatedAt = new Date()
		await stroke.save()

		return { success: true, updatedStroke: stroke }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeStrokeValue error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeStrokeBasis = async ({
	id,
	designId,
	basis,
}: {
	id: IStroke['id']
	designId: IDesign['id']
	basis: string
}): Promise<IDesignTypeStrokeUpdatedResponse> => {
	const stroke = await getStrokeInstance({ id })
	if (!stroke) return { success: false }

	try {
		const data = EditDesignStrokeBasisSchema.parse({ id, designId, basis })
		stroke.basis = data.basis
		stroke.updatedAt = new Date()
		await stroke.save()

		return { success: true, updatedStroke: stroke }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeStrokeBasis error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeStrokeStyle = async ({
	id,
	designId,
	style,
}: {
	id: IStroke['id']
	designId: IDesign['id']
	style: string
}): Promise<IDesignTypeStrokeUpdatedResponse> => {
	const stroke = await getStrokeInstance({ id })
	if (!stroke) return { success: false }

	try {
		const data = EditDesignStrokeStyleSchema.parse({ id, designId, style })
		stroke.style = data.style
		stroke.updatedAt = new Date()
		await stroke.save()

		return { success: true, updatedStroke: stroke }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeStrokeStyle error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
