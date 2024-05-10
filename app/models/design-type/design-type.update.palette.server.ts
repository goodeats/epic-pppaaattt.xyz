import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	type DesignPaletteUpdateSchemaType,
	EditDesignPaletteValueSchema,
} from '#app/schema/palette'
import { ValidateDesignParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { findFirstPaletteInstance } from '#app/utils/prisma-extensions-palette'
import { type IDesign } from '../design.server'
import { type IPalette } from '../palette.server'

export interface IDesignTypePaletteUpdatedResponse {
	success: boolean
	message?: string
	updatedPalette?: IPalette
}

const validateUpdateSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & {
	schema: DesignPaletteUpdateSchemaType
}) => {
	const strategy = new ValidateDesignParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}

export async function validateDesignTypeUpdatePaletteValueSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignPaletteValueSchema,
	})
}

const getPaletteInstance = async ({ id }: { id: IPalette['id'] }) => {
	return await findFirstPaletteInstance({
		where: { id },
	})
}

// updating instance instead of regular prism update
// this may not be easier, but it's more explicit
export const updateDesignTypePaletteValue = async ({
	id,
	designId,
	value,
}: {
	id: IPalette['id']
	designId: IDesign['id']
	value: number
}): Promise<IDesignTypePaletteUpdatedResponse> => {
	const layout = await getPaletteInstance({ id })
	if (!layout) return { success: false }

	try {
		const data = EditDesignPaletteValueSchema.parse({ id, designId, value })
		layout.value = data.value
		layout.updatedAt = new Date()
		await layout.save()

		return { success: true, updatedPalette: layout }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypePaletteValue error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
