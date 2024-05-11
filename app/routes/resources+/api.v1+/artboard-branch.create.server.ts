import {
	type LoaderFunctionArgs,
	json,
	type DataFunctionArgs,
} from '@remix-run/node'
import { redirectBack } from 'remix-utils/redirect-back'
import { validateNewArtboardBranchSubmission } from '#app/models/artboard-branch/artboard-branch.create.server'
import { validateNoJS } from '#app/schema/form-data'
import { artboardBranchCreateService } from '#app/services/artboard/branch/create.service'
import { requireUserId } from '#app/utils/auth.server'

// https://www.epicweb.dev/full-stack-components

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	// this is starting to get messy
	// but want to ensure no redirect if params are valid
	// and service encounters an error
	// ... had to revert back to the original code so fetcher button form doesn't break
	// refactor this later
	let createSuccess = false
	let errorMessage = ''
	// let responseStatus = ''
	const { status, submission } = await validateNewArtboardBranchSubmission({
		userId,
		formData,
	})
	// responseStatus = status

	if (status === 'success') {
		const { success, message } = await artboardBranchCreateService({
			userId,
			...submission.value,
		})
		createSuccess = success
		// responseStatus = success ? 'success' : 'error'
		errorMessage = message || ''
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission, message: errorMessage },
		{
			status: status === 'error' || !createSuccess ? 422 : 201,
		},
	)
}
