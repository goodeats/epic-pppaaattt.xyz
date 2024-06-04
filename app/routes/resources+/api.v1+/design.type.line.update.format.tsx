import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherSelect } from '#app/components/templates/form/fetcher-select'
import { type IDesignWithLine } from '#app/models/design/design.server'
import {
	updateDesignTypeLineFormat,
	validateDesignTypeUpdateLineFormatSubmission,
} from '#app/models/design-type/line/line.update.server'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import {
	EditDesignLineFormatSchema,
	LineFormatTypeEnum,
} from '#app/schema/line'
import { requireUserId } from '#app/utils/auth.server'
import { schemaEnumToSelectOptions } from '#app/utils/forms'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.DESIGN.TYPE.LINE.UPDATE.FORMAT
const schema = EditDesignLineFormatSchema

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
		await validateDesignTypeUpdateLineFormatSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await updateDesignTypeLineFormat({
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

export const DesignTypeLineFormat = ({
	design,
	formLocation = '',
}: {
	design: IDesignWithLine
	formLocation?: string
}) => {
	const designId = design.id
	const lineId = design.line.id
	const field = 'format'
	const fetcherKey = `design-type-line-update-${field}-${designId}-${lineId}`
	const formId = `${fetcherKey}${formLocation ? `-${formLocation}` : ''}`
	const value = design.line[field]
	const options = schemaEnumToSelectOptions(LineFormatTypeEnum)

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
			tooltipText={`Line ${field}`}
			isHydrated={isHydrated}
			placeholder={`Select a ${field}`}
		>
			<div className="hidden">
				<input type="hidden" name="id" value={lineId} />
				<input
					type="hidden"
					name={EntityParentIdType.DESIGN_ID}
					value={designId}
				/>
			</div>
		</FetcherSelect>
	)
}
