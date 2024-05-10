import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	EditDesignSizeValueSchema,
	type DesignSizeUpdateSchemaType,
	EditDesignSizeBasisSchema,
	EditDesignSizeFormatSchema,
} from '#app/schema/size'
import { ValidateDesignParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { findFirstSizeInstance } from '#app/utils/prisma-extensions-size'
import { type IDesign } from '../../design/design.server'
import { type ISize } from './size.server'

export interface IDesignTypeSizeUpdatedResponse {
	success: boolean
	message?: string
	updatedSize?: ISize
}

const validateUpdateSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & {
	schema: DesignSizeUpdateSchemaType
}) => {
	const strategy = new ValidateDesignParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}

export async function validateDesignTypeUpdateSizeValueSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignSizeValueSchema,
	})
}

export async function validateDesignTypeUpdateSizeBasisSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignSizeBasisSchema,
	})
}

export async function validateDesignTypeUpdateSizeFormatSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignSizeFormatSchema,
	})
}

const getSizeInstance = async ({ id }: { id: ISize['id'] }) => {
	return await findFirstSizeInstance({
		where: { id },
	})
}

// updating instance instead of regular prism update
// this may not be easier, but it's more explicit
export const updateDesignTypeSizeValue = async ({
	id,
	designId,
	value,
}: {
	id: ISize['id']
	designId: IDesign['id']
	value: number
}): Promise<IDesignTypeSizeUpdatedResponse> => {
	const size = await getSizeInstance({ id })
	if (!size) return { success: false }

	try {
		const data = EditDesignSizeValueSchema.parse({ id, designId, value })
		size.value = data.value
		size.updatedAt = new Date()
		await size.save()

		return { success: true, updatedSize: size }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeSizeValue error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeSizeBasis = async ({
	id,
	designId,
	basis,
}: {
	id: ISize['id']
	designId: IDesign['id']
	basis: string
}): Promise<IDesignTypeSizeUpdatedResponse> => {
	const size = await getSizeInstance({ id })
	if (!size) return { success: false }

	try {
		const data = EditDesignSizeBasisSchema.parse({ id, designId, basis })
		size.basis = data.basis
		size.updatedAt = new Date()
		await size.save()

		return { success: true, updatedSize: size }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeSizeBasis error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeSizeFormat = async ({
	id,
	designId,
	format,
}: {
	id: ISize['id']
	designId: IDesign['id']
	format: string
}): Promise<IDesignTypeSizeUpdatedResponse> => {
	const size = await getSizeInstance({ id })
	if (!size) return { success: false }

	try {
		const data = EditDesignSizeFormatSchema.parse({ id, designId, format })
		size.format = data.format
		size.updatedAt = new Date()
		await size.save()

		return { success: true, updatedSize: size }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeSizeFormat error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
