import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherIconButton } from '#app/components/templates/form/fetcher-icon-button'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { validateEditVisibleAssetImageArtworkVersionSubmission } from '#app/models/asset/image/image.update.artwork-version.server'
import { EditVisibleAssetImageArtworkVersionSchema } from '#app/schema/asset/image.artwork-version'
import { validateNoJS } from '#app/schema/form-data'
import { assetImageArtworkVersionUpdateVisibleService } from '#app/services/asset.image.artwork-version.update.visible.service'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ASSET.IMAGE.ARTWORK_VERSION.UPDATE_VISIBLE
const schema = EditVisibleAssetImageArtworkVersionSchema

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
		await validateEditVisibleAssetImageArtworkVersionSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success, message } =
			await assetImageArtworkVersionUpdateVisibleService({
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

export const AssetImageArtworkVersionUpdateVisible = ({
	image,
	artworkVersion,
}: {
	image: IAssetImage
	artworkVersion: IArtworkVersion
}) => {
	const imageId = image.id
	const artworkVersionId = artworkVersion.id
	const isVisible = image.visible
	const icon = isVisible ? 'eye-open' : 'eye-closed'
	const iconText = `${isVisible ? 'Hide' : 'Show'} ${image.name}`
	const formId = `asset-image--${imageId}-artworkVersion-${artworkVersionId}-update-visible`

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
				<input type="hidden" name="artworkVersionId" value={artworkVersionId} />
			</div>
		</FetcherIconButton>
	)
}
