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
import { FetcherImageSelect } from '#app/components/templates/form/fetcher-image-select'
import { useArtworkFromVersion } from '#app/models/artwork/hooks'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { useAssetImagesArtwork } from '#app/models/asset/image/hooks'
import { validateNewAssetImageArtworkVersionSubmission } from '#app/models/asset/image/image.create.artwork-version.server'
import { MAX_UPLOAD_SIZE } from '#app/schema/asset/image'
import { CloneAssetImageArtworkToArtworkVersionSchema } from '#app/schema/asset/image.artwork-version'
import { validateNoJS } from '#app/schema/form-data'
import { assetImageArtworkVersionCreateService } from '#app/services/asset.image.artwork-version.create.service'
import { ArtworkAssetImageSrcStrategy } from '#app/strategies/asset.image.src.strategy'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// technically this would be a clone of the artowrk asset image by id

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ASSET.IMAGE.ARTWORK_VERSION.CREATE
const schema = CloneAssetImageArtworkToArtworkVersionSchema

// auth GET request to endpoint
export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	// consider intent if cloning or uploading new image
	const formData = await parseMultipartFormData(
		request,
		createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	)
	const noJS = validateNoJS({ formData })

	let createSuccess = false
	let errorMessage = ''
	const { status, submission } =
		await validateNewAssetImageArtworkVersionSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } = await assetImageArtworkVersionCreateService({
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

export const AssetImageArtworkVersionClone = ({
	version,
}: {
	version: IArtworkVersion
}) => {
	const artworkVersionId = version.id
	const images = useAssetImagesArtwork()
	const artwork = useArtworkFromVersion()
	const artworkId = artwork.id
	const strategy = new ArtworkAssetImageSrcStrategy()
	const formId = `asset-image-artwork-version-${artworkVersionId}-create`

	const fetcher = useFetcher<typeof action>()
	let isHydrated = useHydrated()

	return (
		<FetcherImageSelect
			fetcher={fetcher}
			route={route}
			schema={schema}
			formId={formId}
			images={images}
			strategy={strategy}
			parent={artwork}
			icon="plus"
			iconText="New Image"
			tooltipText="New image..."
			dialogTitle="Add an image from assets"
			dialogDescription="Add an image assets to the artwork version that can be used on many layers."
			isHydrated={isHydrated}
		>
			<div className="hidden">
				<input type="hidden" name="artworkId" value={artworkId} />
				<input type="hidden" name="artworkVersionId" value={artworkVersionId} />
			</div>
		</FetcherImageSelect>
	)
}
