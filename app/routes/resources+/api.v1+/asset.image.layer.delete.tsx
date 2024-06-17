import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherIconConfirm } from '#app/components/templates/form/fetcher-icon-confirm'
import { validateDeleteAssetImageLayerSubmission } from '#app/models/asset/image/image.delete.layer.server'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { DeleteAssetImageLayerSchema } from '#app/schema/asset/image.layer'
import { validateNoJS } from '#app/schema/form-data'
import { assetImageLayerDeleteService } from '#app/services/asset.image.layer.delete.service'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ASSET.IMAGE.LAYER.DELETE
const schema = DeleteAssetImageLayerSchema

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
	const { status, submission } = await validateDeleteAssetImageLayerSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success, message } = await assetImageLayerDeleteService({
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

export const AssetImageLayerDelete = ({
	image,
	layer,
}: {
	image: IAssetImage
	layer: ILayer
}) => {
	const imageId = image.id
	const layerId = layer.id
	const iconText = `Delete Image...`
	const formId = `asset-image-${imageId}-layer-${layerId}-delete`

	const fetcher = useFetcher<typeof action>()
	let isHydrated = useHydrated()

	return (
		<FetcherIconConfirm
			fetcher={fetcher}
			route={route}
			schema={schema}
			formId={formId}
			icon="minus"
			iconText={iconText}
			tooltipText={iconText}
			dialogTitle="Delete image"
			dialogDescription="Are you sure you want to delete this image? This action cannot be undone."
			isHydrated={isHydrated}
		>
			<div className="hidden">
				<input type="hidden" name="id" value={imageId} />
				<input type="hidden" name="layerId" value={layerId} />
			</div>
		</FetcherIconConfirm>
	)
}
