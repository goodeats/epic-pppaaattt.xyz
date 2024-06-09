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

export async function validateEntityImageSubmission({
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
	const submission = await parseEntityImageSubmission({
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

export async function parseEntityImageSubmission({
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
		schema: schema
			.superRefine(async (data, ctx) => {
				strategy.validateFormDataEntity({ userId, data, ctx })
			})
			.transform(transformData),
		async: true,
	})
}

type FormDataWithId = {
	id?: string
	file?: File
	name?: string
	altText?: string
}

async function transformData(data: FormDataWithId) {
	if (data.id) {
		const imageHasFile = Boolean(data.file?.size && data.file?.size > 0)
		if (imageHasFile && data.file) {
			const fileData = await transformFileData(data.file)
			return getImageUpdateData(data, fileData)
		} else {
			return getImageUpdateData(data)
		}
	} else {
		if (data.file && data.file.size > 0) {
			const fileData = await transformFileData(data.file)
			return {
				...data,
				...fileData,
			}
		} else {
			return z.NEVER
		}
	}
}

function getImageUpdateData(
	data: FormDataWithId,
	fileData?: { contentType: string; blob: Buffer },
) {
	return {
		id: data.id,
		name: data.name,
		altText: data.altText,
		...(fileData && fileData),
	}
}

async function transformFileData(file: File) {
	return {
		name: file.name,
		contentType: file.type as string,
		blob: Buffer.from(await file.arrayBuffer()),
	}
}
