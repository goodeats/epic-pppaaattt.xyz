import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import {
	type DesignLayoutUpdateSchemaType,
	EditDesignLayoutCountSchema,
	EditDesignLayoutRowsSchema,
	EditDesignLayoutColumnsSchema,
	EditDesignLayoutStyleSchema,
} from '#app/schema/layout'
import { ValidateDesignParentSubmissionStrategy } from '#app/strategies/validate-submission.strategy'
import { validateEntitySubmission } from '#app/utils/conform-utils'
import { findFirstLayoutInstance } from '#app/utils/prisma-extensions-layout'
import { type IDesign } from '../../design/design.server'
import { type ILayout } from './layout.server'

export interface IDesignTypeLayoutUpdatedResponse {
	success: boolean
	message?: string
	updatedLayout?: ILayout
}

const validateUpdateSubmission = async ({
	userId,
	formData,
	schema,
}: IntentActionArgs & {
	schema: DesignLayoutUpdateSchemaType
}) => {
	const strategy = new ValidateDesignParentSubmissionStrategy()

	return await validateEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
}

export async function validateDesignTypeUpdateLayoutCountSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignLayoutCountSchema,
	})
}

export async function validateDesignTypeUpdateLayoutRowsSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignLayoutRowsSchema,
	})
}

export async function validateDesignTypeUpdateLayoutColumnsSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignLayoutColumnsSchema,
	})
}

export async function validateDesignTypeUpdateLayoutStyleSubmission(
	args: IntentActionArgs,
) {
	return validateUpdateSubmission({
		...args,
		schema: EditDesignLayoutStyleSchema,
	})
}

const getLayoutInstance = async ({ id }: { id: ILayout['id'] }) => {
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
	if (!layout) return { success: false }

	try {
		const data = EditDesignLayoutCountSchema.parse({ id, designId, count })
		layout.count = data.count
		layout.updatedAt = new Date()
		await layout.save()

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

export const updateDesignTypeLayoutRows = async ({
	id,
	designId,
	rows,
}: {
	id: ILayout['id']
	designId: IDesign['id']
	rows: number
}): Promise<IDesignTypeLayoutUpdatedResponse> => {
	const layout = await getLayoutInstance({ id })
	if (!layout) return { success: false }

	try {
		const data = EditDesignLayoutRowsSchema.parse({ id, designId, rows })
		layout.rows = data.rows
		layout.updatedAt = new Date()
		await layout.save()

		return { success: true, updatedLayout: layout }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeLayoutRows error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeLayoutColumns = async ({
	id,
	designId,
	columns,
}: {
	id: ILayout['id']
	designId: IDesign['id']
	columns: number
}): Promise<IDesignTypeLayoutUpdatedResponse> => {
	const layout = await getLayoutInstance({ id })
	if (!layout) return { success: false }

	try {
		const data = EditDesignLayoutColumnsSchema.parse({ id, designId, columns })
		layout.columns = data.columns
		layout.updatedAt = new Date()
		await layout.save()

		return { success: true, updatedLayout: layout }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeLayoutRows error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}

export const updateDesignTypeLayoutStyle = async ({
	id,
	designId,
	style,
}: {
	id: ILayout['id']
	designId: IDesign['id']
	style: number
}): Promise<IDesignTypeLayoutUpdatedResponse> => {
	const layout = await getLayoutInstance({ id })
	if (!layout) return { success: false }

	try {
		const data = EditDesignLayoutStyleSchema.parse({ id, designId, style })
		layout.style = data.style
		layout.updatedAt = new Date()
		await layout.save()

		return { success: true, updatedLayout: layout }
	} catch (error) {
		// consider how to handle this error where this is called
		console.log('updateDesignTypeLayoutRows error:', error)
		const errorType = error instanceof Error
		const errorMessage = errorType ? error.message : 'An unknown error occurred'
		return {
			success: false,
			message: errorMessage,
		}
	}
}
