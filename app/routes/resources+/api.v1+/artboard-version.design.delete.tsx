import {
	type LoaderFunctionArgs,
	json,
	type DataFunctionArgs,
} from '@remix-run/node'
import { redirectBack } from 'remix-utils/redirect-back'
import { validateArtboardVersionDeleteDesignSubmission } from '#app/models/design-artboard-version/design-artboard-version.delete.server'
import { validateNoJS } from '#app/schema/form-data'
import { artboardVersionDesignDeleteService } from '#app/services/artboard/version/design/delete.service'
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

	let deleteSuccess = false
	const { status, submission } =
		await validateArtboardVersionDeleteDesignSubmission({
			userId,
			formData,
		})
	console.log('validation: ', status, submission)

	if (status === 'success') {
		const { success } = await artboardVersionDesignDeleteService({
			userId,
			...submission.value,
		})
		deleteSuccess = success
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission },
		{
			status: status === 'error' || !deleteSuccess ? 404 : 200,
		},
	)
}
