import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherText } from '#app/components/templates/form/fetcher-text'
import { type IAssetType } from '#app/models/asset/asset.server'
import {
	updateDesignTypeFillValue,
	validateDesignTypeUpdateFillValueSubmission,
} from '#app/models/design-type/fill/fill.update.server'
import { EditDesignFillValueSchema } from '#app/schema/fill'
import { validateNoJS } from '#app/schema/form-data'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE.VALUE
const schema = EditDesignFillValueSchema

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
	const { status, submission } =
		await validateDesignTypeUpdateFillValueSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await updateDesignTypeFillValue({
			userId,
			...submission.value,
		})
		updateSuccess = success
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission },
		{
			status: status === 'error' || !updateSuccess ? 404 : 200,
		},
	)
}

export const AssetUpdateName = ({
	asset,
	formLocation = '',
}: {
	asset: IAssetType
	formLocation?: string
}) => {
	const assetId = asset.id
	const field = 'name'
	const fetcherKey = `asset-update-${field}-${assetId}`
	const formId = `${fetcherKey}${formLocation ? `-${formLocation}` : ''}`
	const value = asset[field]

	let isHydrated = useHydrated()
	const fetcher = useFetcher<typeof action>({
		key: fetcherKey,
	})

	return (
		<FetcherText
			fetcher={fetcher}
			fetcherKey={fetcherKey}
			route={route}
			schema={schema}
			formId={formId}
			fieldName={field}
			fieldValue={value}
			tooltipText={`Fill ${field}`}
			isHydrated={isHydrated}
			placeholder={`Select a ${field}`}
			disabled
		>
			<div className="hidden">
				<input type="hidden" name="id" value={assetId} />
			</div>
		</FetcherText>
	)
}
