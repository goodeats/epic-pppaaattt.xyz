import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherIconConfirm } from '#app/components/templates/form/fetcher-icon-confirm'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { validateArtworkImageDeleteSubmission } from '#app/models/images/artwork-image.delete.server'
import { type IArtworkImage } from '#app/models/images/artwork-image.server'
import { DeleteArtworkImageSchema } from '#app/schema/artwork-image'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { artworkImageDeleteService } from '#app/services/artwork/image/delete.service'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK.IMAGE.DELETE
const schema = DeleteArtworkImageSchema

// auth GET request to endpoint
export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let createSuccess = false
	let errorMessage = ''
	const { status, submission } = await validateArtworkImageDeleteSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success, message } = await artworkImageDeleteService({
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

export const ArtworkImageDelete = ({
	image,
	artwork,
}: {
	image: IArtworkImage
	artwork: IArtwork
}) => {
	const imageId = image.id
	const iconText = `Delete Image...`
	const formId = `artwork-image-delete-${imageId}`

	const fetcher = useFetcher<typeof action>()
	let isHydrated = useHydrated()

	return (
		<FetcherIconConfirm
			fetcher={fetcher}
			route={route}
			schema={schema}
			formId={formId}
			icon="trash"
			iconText={iconText}
			tooltipText={iconText}
			dialogTitle="Delete image"
			dialogDescription="Are you sure you want to delete this image? This action cannot be undone."
			isHydrated={isHydrated}
		>
			<div className="hidden">
				<input type="hidden" name="id" value={imageId} />
				<input
					type="hidden"
					name={EntityParentIdType.ARTWORK_ID}
					value={artwork.id}
				/>
			</div>
		</FetcherIconConfirm>
	)
}
