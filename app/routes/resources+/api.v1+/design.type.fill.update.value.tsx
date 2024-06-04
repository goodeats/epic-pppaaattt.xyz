import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherHex } from '#app/components/templates/form/fetcher-hex'
import { type IDesignWithFill } from '#app/models/design/design.server'
import {
	updateDesignTypeFillValue,
	validateDesignTypeUpdateFillValueSubmission,
} from '#app/models/design-type/fill/fill.update.server'
import { EntityParentIdType } from '#app/schema/entity'
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

export const DesignTypeFillValue = ({
	design,
	formLocation = '',
}: {
	design: IDesignWithFill
	formLocation?: string
}) => {
	const designId = design.id
	const fillId = design.fill.id
	const field = 'value'
	const fetcherKey = `design-type-fill-update-${field}-${designId}-${fillId}`
	const formId = `${fetcherKey}${formLocation ? `-${formLocation}` : ''}`
	const value = design.fill[field]

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
			tooltipText={`Fill ${field}`}
			isHydrated={isHydrated}
			placeholder={`Select a ${field}`}
		>
			<div className="hidden">
				<input type="hidden" name="id" value={fillId} />
				<input
					type="hidden"
					name={EntityParentIdType.DESIGN_ID}
					value={designId}
				/>
			</div>
		</FetcherHex>
	)
}
