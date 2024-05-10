import { json } from '@remix-run/node'
import { type IntentActionArgs } from '#app/definitions/intent-action-args'
import { type ILayout } from '#app/models/design-type/layout/layout.server'
import {
	EditDesignLayoutCountSchema,
	EditDesignLayoutColumnsSchema,
	EditDesignLayoutRowsSchema,
	EditDesignLayoutStyleSchema,
} from '#app/schema/layout'
import {
	notSubmissionResponse,
	submissionErrorResponse,
} from '#app/utils/conform-utils'
import { findFirstLayoutInstance } from '#app/utils/prisma-extensions-layout'
import { parseDesignSubmission } from './utils'

async function validateSubmission({
	userId,
	formData,
	schema,
}: {
	userId: string
	formData: FormData
	schema:
		| typeof EditDesignLayoutStyleSchema
		| typeof EditDesignLayoutCountSchema
		| typeof EditDesignLayoutRowsSchema
		| typeof EditDesignLayoutColumnsSchema
}) {
	const submission = await parseDesignSubmission({
		userId,
		formData,
		schema,
	})

	if (submission.intent !== 'submit') {
		return { response: notSubmissionResponse(submission), isValid: false }
	}
	if (!submission.value) {
		return { response: submissionErrorResponse(submission), isValid: false }
	}

	return { submission, isValid: true }
}

export async function designLayoutEditStyleAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignLayoutStyleSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, style } = submission.value
	const layout = await getLayout({ id })
	if (!layout) return submissionErrorResponse(submission)

	layout.style = style
	layout.updatedAt = new Date()
	await layout.save()

	return json({ status: 'success', submission } as const)
}

export async function designLayoutEditCountAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignLayoutCountSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, count } = submission.value
	const layout = await getLayout({ id })
	if (!layout) return submissionErrorResponse(submission)

	layout.count = count
	layout.updatedAt = new Date()
	await layout.save()

	return json({ status: 'success', submission } as const)
}

export async function designLayoutEditRowsAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignLayoutRowsSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, rows } = submission.value
	const layout = await getLayout({ id })
	if (!layout) return submissionErrorResponse(submission)

	layout.rows = rows
	layout.updatedAt = new Date()
	await layout.save()

	return json({ status: 'success', submission } as const)
}

export async function designLayoutEditColumnsAction({
	userId,
	formData,
}: IntentActionArgs) {
	const { submission, isValid, response } = await validateSubmission({
		userId,
		formData,
		schema: EditDesignLayoutColumnsSchema,
	})
	if (!isValid || !submission) return response

	// changes
	const { id, columns } = submission.value
	const layout = await getLayout({ id })
	if (!layout) return submissionErrorResponse(submission)

	layout.columns = columns
	layout.updatedAt = new Date()
	await layout.save()

	return json({ status: 'success', submission } as const)
}

const getLayout = async ({ id }: { id: ILayout['id'] }) => {
	return await findFirstLayoutInstance({
		where: { id },
	})
}
