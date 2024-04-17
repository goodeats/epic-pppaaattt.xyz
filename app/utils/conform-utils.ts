import { type Submission } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { type TypedResponse, json } from '@remix-run/node'
import { z } from 'zod'
import { type IValidateSubmissionStrategy } from '#app/strategies/validate-submission.strategy'

type NotSubmissionResponseType = TypedResponse<{
	readonly status: 'idle'
	readonly submission: Submission
}>

export const notSubmissionResponse = (
	submission: Submission,
): NotSubmissionResponseType => json({ status: 'idle', submission } as const)

type SubmissionErrorResponseType = TypedResponse<{
	readonly status: 'error'
	readonly submission: Submission
}>

export const submissionErrorResponse = (
	submission: Submission,
): SubmissionErrorResponseType =>
	json({ status: 'error', submission } as const, { status: 400 })

type SubmissionSuccessResponseType = TypedResponse<{
	readonly status: 'success'
	readonly submission: Submission
}>

export const submissionSuccessResponse = (
	submission: Submission,
): SubmissionSuccessResponseType =>
	json({ status: 'success', submission } as const, { status: 200 })

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
}): Promise<{
	submission?: Submission
	response:
		| NotSubmissionResponseType
		| SubmissionErrorResponseType
		| SubmissionSuccessResponseType
	isValid: boolean
}> {
	const submission = await parseEntitySubmission({
		userId,
		formData,
		schema,
		strategy,
	})

	if (submission.intent !== 'submit') {
		return { response: notSubmissionResponse(submission), isValid: false }
	}
	if (!submission.value) {
		return { response: submissionErrorResponse(submission), isValid: false }
	}

	return {
		submission,
		response: submissionSuccessResponse(submission),
		isValid: true,
	}
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
}): Promise<any> {
	return await parse(formData, {
		schema: schema.superRefine(async (data, ctx) => {
			strategy.validateFormDataEntity({ userId, data, ctx })
		}),
		async: true,
	})
}
