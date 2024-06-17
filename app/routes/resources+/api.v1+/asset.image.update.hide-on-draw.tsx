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
import { validateEditHideOnDrawAssetImageSubmission } from '#app/models/asset/image/image.update.hide-on-draw.server'
import { EditAssetImageHideOnDrawSchema } from '#app/schema/asset/image'
import { validateNoJS } from '#app/schema/form-data'
import { assetImageUpdateHideOnDrawService } from '#app/services/asset.image.update.hide-on-draw.service'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ASSET.IMAGE.UPDATE.HIDE_ON_DRAW
const schema = EditAssetImageHideOnDrawSchema

// auth GET request to endpoint
export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let updateSuccess = false
	let errorMessage = ''
	const { status, submission } =
		await validateEditHideOnDrawAssetImageSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } = await assetImageUpdateHideOnDrawService({
			userId,
			...submission.value,
		})
		updateSuccess = success
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
			status: status === 'error' || !updateSuccess ? 404 : 200,
		},
	)
}

export const AssetImageUpdateHideOnDraw = ({
	image,
	formLocation = '',
}: {
	image: IAssetImage
	formLocation?: string
}) => {
	const assetId = image.id
	const field = 'hideOnDraw'
	const isHiddenOnDraw = image.attributes[field] || false
	const icon = isHiddenOnDraw ? 'eye-none' : 'eye-open'
	const iconText = `${isHiddenOnDraw ? 'Show' : 'Show'} on draw`
	const fetcherKey = `asset-image-update-${field}-${assetId}`
	const formId = `${fetcherKey}${formLocation ? `-${formLocation}` : ''}`

	let isHydrated = useHydrated()
	const fetcher = useFetcher<typeof action>({
		key: fetcherKey,
	})

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
				<input type="hidden" name="id" value={assetId} />
			</div>
		</FetcherIconButton>
	)
}
