import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherHex } from '#app/components/templates/form/fetcher-hex'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { validateArtworkVersionBackgroundSubmission } from '#app/models/artwork-version/artwork-version.update.server'
import { ArtworkVersionBackgroundSchema } from '#app/schema/artwork-version'
import { validateNoJS } from '#app/schema/form-data'
import { updateArtworkVersionBackgroundService } from '#app/services/artwork/version/update.service'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

const route = Routes.RESOURCES.API.V1.ARTWORK_VERSION.UPDATE.BACKGROUND
const schema = ArtworkVersionBackgroundSchema

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
		await validateArtworkVersionBackgroundSubmission({
			userId,
			formData,
		})
	let updateSucess = false
	if (status === 'success') {
		const { success } = await updateArtworkVersionBackgroundService({
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

export const ArtworkVersionBackground = ({
	version,
}: {
	version: IArtworkVersion
}) => {
	const versionId = version.id
	const field = 'background'
	const fetcherKey = `artwork-version-update-${field}-${versionId}`
	const formId = `${fetcherKey}`
	const value = version[field]

	let isHydrated = useHydrated()
	const fetcher = useFetcher<typeof action>({
		key: fetcherKey,
	})

	return (
		<FetcherHex
			fetcher={fetcher}
			fetcherKey={fetcherKey}
			route={route}
			schema={schema}
			formId={formId}
			selectName={field}
			selectValue={value}
			tooltipText={`Artwork ${field}`}
			isHydrated={isHydrated}
			placeholder={`Set ${field}`}
		>
			<div className="hidden">
				<input type="hidden" name="id" value={versionId} />
			</div>
		</FetcherHex>
	)
}
