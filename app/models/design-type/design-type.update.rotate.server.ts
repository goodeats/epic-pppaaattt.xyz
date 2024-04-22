import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	type DesignRotateUpdateSchemaType,
	EditDesignRotateBasisSchema,
	EditDesignRotateValueSchema,
} from '#app/schema/rotate'
import { ValidateDesignParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { findFirstRotateInstance } from '#app/utils/prisma-extensions-rotate'
import { type IDesign } from '../design.server'
import { type IRotate } from '../rotate.server'

export interface IDesignTypeRotateUpdatedResponse {
	success: boolean
	message?: string
	updatedRotate?: IRotate
}

const validateUpdateSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & {
	schema: DesignRotateUpdateSchemaType
}) => {
	const strategy = new ValidateDesignParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}

export async function validateDesignTypeUpdateRotateValueSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignRotateValueSchema,
	})
}

export async function validateDesignTypeUpdateRotateBasisSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignRotateBasisSchema,
	})
}

const getRotateInstance = async ({ id }: { id: IRotate['id'] }) => {
	return await findFirstRotateInstance({
		where: { id },
	})
}

// updating instance instead of regular prism update
// this may not be easier, but it's more explicit
export const updateDesignTypeRotateValue = async ({
	id,
	designId,
	value,
}: {
	id: IRotate['id']
	designId: IDesign['id']
	value: number
}): Promise<IDesignTypeRotateUpdatedResponse> => {
	const rotate = await getRotateInstance({ id })
	if (!rotate) return { success: false }

	try {
		const data = EditDesignRotateValueSchema.parse({ id, designId, value })
		rotate.value = data.value
		rotate.updatedAt = new Date()
		await rotate.save()

		return { success: true, updatedRotate: rotate }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeRotateValue error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeRotateBasis = async ({
	id,
	designId,
	basis,
}: {
	id: IRotate['id']
	designId: IDesign['id']
	basis: string
}): Promise<IDesignTypeRotateUpdatedResponse> => {
	const rotate = await getRotateInstance({ id })
	if (!rotate) return { success: false }

	try {
		const data = EditDesignRotateBasisSchema.parse({ id, designId, basis })
		rotate.basis = data.basis
		rotate.updatedAt = new Date()
		await rotate.save()

		return { success: true, updatedRotate: rotate }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeRotateBasis error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
