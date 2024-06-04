import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherNumber } from '#app/components/templates/form/fetcher-number'
import { type IDesignWithSize } from '#app/models/design/design.server'
import {
	updateDesignTypeSizeValue,
	validateDesignTypeUpdateSizeValueSubmission,
} from '#app/models/design-type/size/size.update.server'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { EditDesignSizeValueSchema } from '#app/schema/size'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.DESIGN.TYPE.SIZE.UPDATE.VALUE
const schema = EditDesignSizeValueSchema

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
		await validateDesignTypeUpdateSizeValueSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await updateDesignTypeSizeValue({
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

export const DesignTypeSizeValue = ({
	design,
	formLocation,
}: {
	design: IDesignWithSize
	formLocation?: string
}) => {
	const designId = design.id
	const sizeId = design.size.id
	const field = 'value'
	const fetcherKey = `design-type-size-update-${field}-${designId}-${sizeId}`
	const formId = `${fetcherKey}${formLocation ? `-${formLocation}` : ''}`
	const value = design.size[field]

	let isHydrated = useHydrated()
	const fetcher = useFetcher<typeof action>({
		key: fetcherKey,
	})

	return (
		<FetcherNumber
			fetcher={fetcher}
			fetcherKey={fetcherKey}
			route={route}
			schema={schema}
			formId={formId}
			fieldName={field}
			fieldValue={value}
			tooltipText={`Size ${field}`}
			isHydrated={isHydrated}
			placeholder={`Set ${field}`}
		>
			<div className="hidden">
				<input type="hidden" name="id" value={sizeId} />
				<input
					type="hidden"
					name={EntityParentIdType.DESIGN_ID}
					value={designId}
				/>
			</div>
		</FetcherNumber>
	)
}
