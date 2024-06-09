import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	unstable_createMemoryUploadHandler as createMemoryUploadHandler,
	unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherImageUpload } from '#app/components/templates/form/fetcher-image-upload'
import { type IArtworkImage } from '#app/models/images/artwork-image.server'
import { validateEditArtworkImageSubmission } from '#app/models/images/artwork-image.update.server'
import {
	EditArtworkImageSchema,
	MAX_UPLOAD_SIZE,
} from '#app/schema/artwork-image'
import { validateNoJS } from '#app/schema/form-data'
import { artworkImageUpdateService } from '#app/services/artwork/image/update.service'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK.IMAGE.UPDATE
const schema = EditArtworkImageSchema

// auth GET request to endpoint
export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await parseMultipartFormData(
		request,
		createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	)
	const noJS = validateNoJS({ formData })

	let createSuccess = false
	let errorMessage = ''
	const { status, submission } = await validateEditArtworkImageSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success, message } = await artworkImageUpdateService({
			userId,
			...submission.value,
		})

		createSuccess = success
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

export const ArtworkImageUpdate = ({ image }: { image: IArtworkImage }) => {
	const imageId = image.id
	const formId = `artwork-image-update-${imageId}`

	const fetcher = useFetcher<typeof action>()
	let isHydrated = useHydrated()

	return (
		<FetcherImageUpload
			fetcher={fetcher}
			route={route}
			schema={schema}
			formId={formId}
			image={image}
			icon="pencil-1"
			iconText="Edit Image"
			tooltipText="Edit image..."
			dialogTitle="Edit image"
			dialogDescription="Update the image for the artwork that can be used on many layers, branches, and versions."
			isHydrated={isHydrated}
		>
			<div className="hidden">
				<input type="hidden" name="id" value={imageId} />
			</div>
		</FetcherImageUpload>
	)
}
