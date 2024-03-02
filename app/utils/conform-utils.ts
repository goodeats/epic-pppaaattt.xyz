import { type Submission } from '@conform-to/react'
import { json } from '@remix-run/node'
import { z } from 'zod'

export const notSubmissionResponse = (submission: Submission) =>
	json({ status: 'idle', submission } as const)

export const submissionErrorResponse = (submission: Submission) =>
	json({ status: 'error', submission } as const, { status: 400 })

export const addNotFoundIssue = (entity: string) => {
	return {
		code: z.ZodIssueCode.custom,
		message: `${entity} not found`,
	}
}
