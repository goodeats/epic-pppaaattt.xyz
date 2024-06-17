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
import { validateNewAssetImageLayerSubmission } from '#app/models/asset/image/image.create.layer.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { MAX_UPLOAD_SIZE } from '#app/schema/asset/image'
import { NewAssetImageLayerSchema } from '#app/schema/asset/image.layer'
import { validateNoJS } from '#app/schema/form-data'
import { assetImageLayerCreateService } from '#app/services/asset.image.layer.create.service'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ASSET.IMAGE.LAYER.CREATE
const schema = NewAssetImageLayerSchema

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
	const { status, submission } = await validateNewAssetImageLayerSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success, message } = await assetImageLayerCreateService({
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

export const AssetImageLayerCreate = ({ layer }: { layer: ILayer }) => {
	const layerId = layer.id
	const formId = `asset-image-layer-${layerId}-create`

	const fetcher = useFetcher<typeof action>()
	let isHydrated = useHydrated()

	return (
		<FetcherImageUpload
			fetcher={fetcher}
			route={route}
			schema={schema}
			formId={formId}
			icon="plus"
			iconText="New Image"
			tooltipText="New image..."
			dialogTitle="Add a new image"
			dialogDescription="Add an image to the layer."
			isHydrated={isHydrated}
		>
			<div className="hidden">
				<input type="hidden" name="layerId" value={layerId} />
			</div>
		</FetcherImageUpload>
	)
}
