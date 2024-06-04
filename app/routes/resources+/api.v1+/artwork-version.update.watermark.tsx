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
import { validateArtworkVersionWatermarkSubmission } from '#app/models/artwork-version/artwork-version.update.server'
import { ArtworkVersionWatermarkSchema } from '#app/schema/artwork-version'
import { validateNoJS } from '#app/schema/form-data'
import { updateArtworkVersionWatermarkService } from '#app/services/artwork/version/update.service'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

const route = Routes.RESOURCES.API.V1.ARTWORK_VERSION.UPDATE.WATERMARK
const schema = ArtworkVersionWatermarkSchema

// auth GET request to endpoint
export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	const { status, submission } =
		await validateArtworkVersionWatermarkSubmission({
			userId,
			formData,
		})
	let updateSucess = false
	if (status === 'success') {
		const { success } = await updateArtworkVersionWatermarkService({
			...submission.value,
		})
		updateSucess = success
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission },
		{ status: status === 'error' || !updateSucess ? 400 : 200 },
	)
}

export const ArtworkVersionWatermark = ({
	version,
}: {
	version: IArtworkVersion
}) => {
	const versionId = version.id
	const field = 'watermark'
	const displayWatermark = version.watermark
	const icon = displayWatermark ? 'eye-open' : 'eye-closed'
	const iconText = `${displayWatermark ? 'Hide' : 'Show'} Artwork ${field}`
	const fetcherKey = `artwork-version-update-${field}-${versionId}`
	const formId = `${fetcherKey}`

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
				<input type="hidden" name="id" value={versionId} />
			</div>
		</FetcherIconButton>
	)
}
