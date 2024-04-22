import {
	type LoaderFunctionArgs,
	json,
	type DataFunctionArgs,
} from '@remix-run/node'
import { redirectBack } from 'remix-utils/redirect-back'
import { validateArtboardVersionHeightSubmission } from '#app/models/artboard-version/artboard-version.update.server'
import { validateNoJS } from '#app/schema/form-data'
import { updateArtboardVersionHeightService } from '#app/services/artboard/version/update.service'
import { requireUserId } from '#app/utils/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	const { status, submission } = await validateArtboardVersionHeightSubmission({
		userId,
		formData,
	})
	let updateSucess = false
	if (status === 'success') {
		const { success } = await updateArtboardVersionHeightService({
			...submission.value,
		})
		updateSucess = success
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission },
		{ status: status === 'error' || !updateSucess ? 400 : 200 },
	)
}
