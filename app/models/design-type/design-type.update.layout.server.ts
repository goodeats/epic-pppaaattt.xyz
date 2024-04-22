import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { EditDesignLayoutCountSchema } from '#app/schema/layout'
import { ValidateDesignParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { findFirstLayoutInstance } from '#app/utils/prisma-extensions-layout'
import { type IDesign } from '../design.server'
import { type ILayout } from '../layout.server'

export interface IDesignTypeLayoutUpdatedResponse {
	success: boolean
	message?: string
	updatedLayout?: ILayout
}

export const validateDesignTypeUpdateLayoutCountSubmission = async ({
	userId,
	formData,
}: IntentActionArgs) => {
	const strategy = new ValidateDesignParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema: EditDesignLayoutCountSchema,
		strategy,
	})
}

const getLayoutInstance = async ({ id }: { id: ILayout['id'] }) => {
	console.log('id', id)
	return await findFirstLayoutInstance({
		where: { id },
	})
}

// updating instance instead of regular prism update
// this may not be easier, but it's more explicit
export const updateDesignTypeLayoutCount = async ({
	id,
	designId,
	count,
}: {
	id: ILayout['id']
	designId: IDesign['id']
	count: number
}): Promise<IDesignTypeLayoutUpdatedResponse> => {
	const layout = await getLayoutInstance({ id })
	console.log('layout', layout)
	if (!layout) return { success: false }

	try {
		console.log('gona schema', { id, designId, count })

		const data = EditDesignLayoutCountSchema.parse({ id, designId, count })
		console.log('data', data)
		layout.count = data.count
		layout.updatedAt = new Date()
		console.log('layout', layout)
		await layout.save()
		console.log('layout', layout)

		return { success: true, updatedLayout: layout }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeLayoutCount error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
