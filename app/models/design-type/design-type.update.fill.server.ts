import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	EditDesignFillValueSchema,
	type DesignFillUpdateSchemaType,
	EditDesignFillBasisSchema,
	EditDesignFillStyleSchema,
} from '#app/schema/fill'
import { ValidateDesignParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { findFirstFillInstance } from '#app/utils/prisma-extensions-fill'
import { type IDesign } from '../design.server'
import { type IFill } from '../fill.server'

export interface IDesignTypeFillUpdatedResponse {
	success: boolean
	message?: string
	updatedFill?: IFill
}

const validateUpdateSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & {
	schema: DesignFillUpdateSchemaType
}) => {
	const strategy = new ValidateDesignParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}

export async function validateDesignTypeUpdateFillValueSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignFillValueSchema,
	})
}

export async function validateDesignTypeUpdateFillBasisSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignFillBasisSchema,
	})
}

export async function validateDesignTypeUpdateFillStyleSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignFillStyleSchema,
	})
}

const getFillInstance = async ({ id }: { id: IFill['id'] }) => {
	return await findFirstFillInstance({
		where: { id },
	})
}

// updating instance instead of regular prism update
// this may not be easier, but it's more explicit
export const updateDesignTypeFillValue = async ({
	id,
	designId,
	value,
}: {
	id: IFill['id']
	designId: IDesign['id']
	value: number
}): Promise<IDesignTypeFillUpdatedResponse> => {
	const fill = await getFillInstance({ id })
	if (!fill) return { success: false }

	try {
		const data = EditDesignFillValueSchema.parse({ id, designId, value })
		fill.value = data.value
		fill.updatedAt = new Date()
		await fill.save()

		return { success: true, updatedFill: fill }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeFillValue error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeFillBasis = async ({
	id,
	designId,
	basis,
}: {
	id: IFill['id']
	designId: IDesign['id']
	basis: string
}): Promise<IDesignTypeFillUpdatedResponse> => {
	const fill = await getFillInstance({ id })
	if (!fill) return { success: false }

	try {
		const data = EditDesignFillBasisSchema.parse({ id, designId, basis })
		fill.basis = data.basis
		fill.updatedAt = new Date()
		await fill.save()

		return { success: true, updatedFill: fill }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeFillBasis error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeFillStyle = async ({
	id,
	designId,
	style,
}: {
	id: IFill['id']
	designId: IDesign['id']
	style: string
}): Promise<IDesignTypeFillUpdatedResponse> => {
	const fill = await getFillInstance({ id })
	if (!fill) return { success: false }

	try {
		const data = EditDesignFillStyleSchema.parse({ id, designId, style })
		fill.style = data.style
		fill.updatedAt = new Date()
		await fill.save()

		return { success: true, updatedFill: fill }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeFillStyle error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
