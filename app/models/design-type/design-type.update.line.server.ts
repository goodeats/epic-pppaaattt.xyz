import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	EditDesignLineWidthSchema,
	type DesignLineUpdateSchemaType,
	EditDesignLineBasisSchema,
	EditDesignLineFormatSchema,
} from '#app/schema/line'
import { ValidateDesignParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { findFirstLineInstance } from '#app/utils/prisma-extensions-line'
import { type IDesign } from '../design.server'
import { type ILine } from '../line.server'

export interface IDesignTypeLineUpdatedResponse {
	success: boolean
	message?: string
	updatedLine?: ILine
}

const validateUpdateSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & {
	schema: DesignLineUpdateSchemaType
}) => {
	const strategy = new ValidateDesignParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}

export async function validateDesignTypeUpdateLineWidthSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignLineWidthSchema,
	})
}

export async function validateDesignTypeUpdateLineBasisSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignLineBasisSchema,
	})
}

export async function validateDesignTypeUpdateLineFormatSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignLineFormatSchema,
	})
}

const getLineInstance = async ({ id }: { id: ILine['id'] }) => {
	return await findFirstLineInstance({
		where: { id },
	})
}

// updating instance instead of regular prism update
// this may not be easier, but it's more explicit
export const updateDesignTypeLineWidth = async ({
	id,
	designId,
	width,
}: {
	id: ILine['id']
	designId: IDesign['id']
	width: number
}): Promise<IDesignTypeLineUpdatedResponse> => {
	const line = await getLineInstance({ id })
	if (!line) return { success: false }

	try {
		const data = EditDesignLineWidthSchema.parse({ id, designId, width })
		line.width = data.width
		line.updatedAt = new Date()
		await line.save()

		return { success: true, updatedLine: line }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeLineWidth error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeLineBasis = async ({
	id,
	designId,
	basis,
}: {
	id: ILine['id']
	designId: IDesign['id']
	basis: string
}): Promise<IDesignTypeLineUpdatedResponse> => {
	const line = await getLineInstance({ id })
	if (!line) return { success: false }

	try {
		const data = EditDesignLineBasisSchema.parse({ id, designId, basis })
		line.basis = data.basis
		line.updatedAt = new Date()
		await line.save()

		return { success: true, updatedLine: line }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeLineBasis error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeLineFormat = async ({
	id,
	designId,
	format,
}: {
	id: ILine['id']
	designId: IDesign['id']
	format: string
}): Promise<IDesignTypeLineUpdatedResponse> => {
	const line = await getLineInstance({ id })
	if (!line) return { success: false }

	try {
		const data = EditDesignLineFormatSchema.parse({ id, designId, format })
		line.format = data.format
		line.updatedAt = new Date()
		await line.save()

		return { success: true, updatedLine: line }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeLineStyle error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
