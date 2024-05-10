import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	EditDesignTemplateStyleSchema,
	type DesignTemplateUpdateSchemaType,
} from '#app/schema/template'
import { ValidateDesignParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { findFirstTemplateInstance } from '#app/utils/prisma-extensions-template'
import { type IDesign } from '../../design/design.server'
import { type ITemplate } from './template.server'

export interface IDesignTypeTemplateUpdatedResponse {
	success: boolean
	message?: string
	updatedTemplate?: ITemplate
}

const validateUpdateSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & {
	schema: DesignTemplateUpdateSchemaType
}) => {
	const strategy = new ValidateDesignParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}

export async function validateDesignTypeUpdateTemplateStyleSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignTemplateStyleSchema,
	})
}

const getTemplateInstance = async ({ id }: { id: ITemplate['id'] }) => {
	return await findFirstTemplateInstance({
		where: { id },
	})
}

// updating instance instead of regular prism update
// this may not be easier, but it's more explicit
export const updateDesignTypeTemplateStyle = async ({
	id,
	designId,
	style,
}: {
	id: ITemplate['id']
	designId: IDesign['id']
	style: string
}): Promise<IDesignTypeTemplateUpdatedResponse> => {
	const template = await getTemplateInstance({ id })
	if (!template) return { success: false }

	try {
		const data = EditDesignTemplateStyleSchema.parse({ id, designId, style })
		template.style = data.style
		template.updatedAt = new Date()
		await template.save()

		return { success: true, updatedTemplate: template }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeTemplateStyle error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
