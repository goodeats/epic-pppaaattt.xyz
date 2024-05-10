import { type Submission } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { z } from 'zod'
import { type IValidateSubmissionStrategy } from '#app/strategies/validate-submission.strategy'

export const notSubmissionResponse = (submission: Submission) =>
	({ status: 'idle', submission }) as const

export const submissionErrorResponse = (submission: Submission) =>
	({ status: 'error', submission }) as const

export const submissionSuccessResponse = (submission: Submission) =>
	({ status: 'success', submission }) as const

export const addNotFoundIssue = (entity: string) => {
	return {
		code: z.ZodIssueCode.custom,
		message: `${entity} not found`,
	}
}

export async function validateEntitySubmission({
	userId,
	formData,
	schema,
	strategy,
}: {
	userId: string
	formData: FormData
	schema: z.ZodSchema<any>
	strategy: IValidateSubmissionStrategy
}) {
	const submission = await parseEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})
	if (submission.intent !== 'submit') {
		return notSubmissionResponse(submission)
	}
	if (!submission.value) {
		return submissionErrorResponse(submission)
	}
	return submissionSuccessResponse(submission)
}

export async function parseEntitySubmission({
	userId,
	formData,
	schema,
	strategy,
}: {
	userId: string
	formData: FormData
	schema: z.ZodSchema<any>
	strategy: IValidateSubmissionStrategy
}) {
	return await parse(formData, {
		schema: schema.superRefine(async (data, ctx) => {
			strategy.validateFormDataEntity({ userId, data, ctx })
		}),
		async: true,
	})
}
