import {
	type LoaderFunctionArgs,
	json,
	type DataFunctionArgs,
} from '@remix-run/node'
import { redirectBack } from 'remix-utils/redirect-back'
import { validateLayerDeleteDesignSubmission } from '#app/models/design-layer/design-layer.delete.server'
import { validateNoJS } from '#app/schema/form-data'
import { layerDesignDeleteService } from '#app/services/layer/design/delete.service'
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
	const { status, submission } = await validateLayerDeleteDesignSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success } = await layerDesignDeleteService({
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
