import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherIconButton } from '#app/components/templates/form/fetcher-icon-button'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { validateEditVisibleAssetImageLayerSubmission } from '#app/models/asset/image/image.update.layer.visible.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { EditVisibleAssetImageLayerSchema } from '#app/schema/asset/image.layer'
import { validateNoJS } from '#app/schema/form-data'
import { assetImageLayerUpdateVisibleService } from '#app/services/asset.image.layer.update.visible.service'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ASSET.IMAGE.LAYER.UPDATE_VISIBLE
const schema = EditVisibleAssetImageLayerSchema

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
	const { status, submission } =
		await validateEditVisibleAssetImageLayerSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } = await assetImageLayerUpdateVisibleService({
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

export const AssetImageLayerUpdateVisible = ({
	image,
	layer,
}: {
	image: IAssetImage
	layer: ILayer
}) => {
	const imageId = image.id
	const layerId = layer.id
	const isVisible = image.visible
	const icon = isVisible ? 'eye-open' : 'eye-closed'
	const iconText = `${isVisible ? 'Hide' : 'Show'} ${image.name}`
	const formId = `asset-image-${imageId}-layer-${layerId}-update-visible`

	const fetcher = useFetcher<typeof action>()
	let isHydrated = useHydrated()

	return (
		<FetcherIconButton
			fetcher={fetcher}
			route={route}
			schema={schema}
			formId={formId}
			icon={icon}
			iconText={iconText}
			tooltipText={iconText}
			isHydrated={isHydrated}
		>
			<div className="hidden">
				<input type="hidden" name="id" value={imageId} />
				<input type="hidden" name="layerId" value={layerId} />
			</div>
		</FetcherIconButton>
	)
}
