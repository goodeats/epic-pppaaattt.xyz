import {
	type LoaderFunctionArgs,
	json,
	type DataFunctionArgs,
} from '@remix-run/node'
import { redirectBack } from 'remix-utils/redirect-back'
import { validateLayerReorderDesignSubmission } from '#app/models/design-layer/design-layer.update.server'
import { validateNoJS } from '#app/schema/form-data'
import { layerDesignMoveDownService } from '#app/services/layer/design/move-down.service'
import { layerDesignMoveUpService } from '#app/services/layer/design/move-up.service'
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

	let updateSuccess = false
	const { status, submission } = await validateLayerReorderDesignSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { direction } = submission.value
		const { success } =
			direction === 'up'
				? await layerDesignMoveUpService({
						userId,
						...submission.value,
				  })
				: await layerDesignMoveDownService({
						userId,
						...submission.value,
				  })
		updateSuccess = success
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission },
		{
			status: status === 'error' || !updateSuccess ? 404 : 200,
		},
	)
}
