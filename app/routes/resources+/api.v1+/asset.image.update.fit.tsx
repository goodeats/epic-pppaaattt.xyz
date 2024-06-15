import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherSelect } from '#app/components/templates/form/fetcher-select'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { validateEditFitAssetImageSubmission } from '#app/models/asset/image/image.update.fit.server'
import {
	AssetImageFitTypeEnum,
	EditAssetImageFitSchema,
} from '#app/schema/asset/image'
import { validateNoJS } from '#app/schema/form-data'
import { assetImageUpdateFitService } from '#app/services/asset.image.update.fit.service'
import { requireUserId } from '#app/utils/auth.server'
import { schemaEnumToSelectOptions } from '#app/utils/forms'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ASSET.IMAGE.UPDATE.FIT
const schema = EditAssetImageFitSchema

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
	const { status, submission } = await validateEditFitAssetImageSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success, message } = await assetImageUpdateFitService({
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

export const AssetImageUpdateFit = ({
	image,
	formLocation = '',
}: {
	image: IAssetImage
	formLocation?: string
}) => {
	const assetId = image.id
	const field = 'fit'
	const fetcherKey = `asset-image-update-${field}-${assetId}`
	const formId = `${fetcherKey}${formLocation ? `-${formLocation}` : ''}`
	const value = image.attributes[field] || ''
	const options = schemaEnumToSelectOptions(AssetImageFitTypeEnum)

	let isHydrated = useHydrated()
	const fetcher = useFetcher<typeof action>({
		key: fetcherKey,
	})

	return (
		<FetcherSelect
			fetcher={fetcher}
			fetcherKey={fetcherKey}
			route={route}
			schema={schema}
			formId={formId}
			fieldName={field}
			fieldValue={value}
			options={options}
			tooltipText={`Image ${field}`}
			isHydrated={isHydrated}
			placeholder={`Select a ${field}`}
		>
			<div className="hidden">
				<input type="hidden" name="id" value={assetId} />
			</div>
		</FetcherSelect>
	)
}
