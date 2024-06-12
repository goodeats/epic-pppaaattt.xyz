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
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { validateEditAssetImageArtworkSubmission } from '#app/models/asset/image/image.update.server'
import {
	EditAssetImageArtworkSchema,
	MAX_UPLOAD_SIZE,
} from '#app/schema/asset/image'
import { validateNoJS } from '#app/schema/form-data'
import { assetImageArtworkUpdateService } from '#app/services/asset.image.artwork.update.service'
import { requireUserId } from '#app/utils/auth.server'
import { getArtworkAssetImgSrc } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ASSET.IMAGE.ARTWORK.UPDATE
const schema = EditAssetImageArtworkSchema

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
	const { status, submission } = await validateEditAssetImageArtworkSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success, message } = await assetImageArtworkUpdateService({
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

export const AssetImageArtworkUpdate = ({
	image,
	artwork,
}: {
	image: IAssetImage
	artwork: IArtwork
}) => {
	const imageId = image.id
	const artworkId = artwork.id
	const formId = `asset-image-${imageId}-artwork-${artworkId}-update`
	const imgSrc = getArtworkAssetImgSrc({ imageId, artworkId })

	const fetcher = useFetcher<typeof action>()
	let isHydrated = useHydrated()

	return (
		<FetcherImageUpload
			fetcher={fetcher}
			route={route}
			schema={schema}
			formId={formId}
			image={image}
			imgSrc={imgSrc}
			icon="pencil-1"
			iconText="Edit Image"
			tooltipText="Edit image..."
			dialogTitle="Edit image"
			dialogDescription="Update the image for the artwork that can be used on many layers, branches, and versions."
			isHydrated={isHydrated}
		>
			<div className="hidden">
				<input type="hidden" name="id" value={imageId} />
				<input type="hidden" name="artworkId" value={artworkId} />
			</div>
		</FetcherImageUpload>
	)
}
