import {
	type LoaderFunctionArgs,
	json,
	type DataFunctionArgs,
} from '@remix-run/node'
import { redirectBack } from 'remix-utils/redirect-back'
import { validateArtboardVersionNewDesignSubmission } from '#app/models/design-artboard-version/design-artboard-version.create.server'
import { validateNoJS } from '#app/schema/form-data'
import { artboardVersionDesignCreateService } from '#app/services/artboard/version/design/create.service'
import { requireUserId } from '#app/utils/auth.server'
import { type ObjectValues } from '#app/utils/typescript-helpers'

// https://www.epicweb.dev/full-stack-components

export const PANEL_ENTITY_NEW_INTENT = {
	createArtboardVersionDesignType:
		'create-artboard-version-design-type' as const,
}
export type panelEntityNewIntent = ObjectValues<typeof PANEL_ENTITY_NEW_INTENT>

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let createSuccess = false
	const { status, submission } =
		await validateArtboardVersionNewDesignSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await artboardVersionDesignCreateService({
			userId,
			...submission.value,
		})
		createSuccess = success
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission },
		{
			status: status === 'error' || !createSuccess ? 422 : 201,
		},
	)
}
