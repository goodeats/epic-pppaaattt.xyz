import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherSelect } from '#app/components/templates/form/fetcher-select'
import { type IDesignWithFill } from '#app/models/design/design.server'
import {
	updateDesignTypeFillBasis,
	validateDesignTypeUpdateFillBasisSubmission,
} from '#app/models/design-type/fill/fill.update.server'
import { EntityParentIdType } from '#app/schema/entity'
import { EditDesignFillBasisSchema, FillBasisTypeEnum } from '#app/schema/fill'
import { validateNoJS } from '#app/schema/form-data'
import { requireUserId } from '#app/utils/auth.server'
import { schemaEnumToSelectOptions } from '#app/utils/forms'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE.BASIS
const schema = EditDesignFillBasisSchema

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
		await validateDesignTypeUpdateFillBasisSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await updateDesignTypeFillBasis({
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

export const DesignTypeFillBasis = ({
	design,
	formLocation = '',
}: {
	design: IDesignWithFill
	formLocation?: string
}) => {
	const designId = design.id
	const fillId = design.fill.id
	const formId = `design-type-fill-update-basis-${designId}-${fillId}${
		formLocation ? `-${formLocation}` : ''
	}`
	const options = schemaEnumToSelectOptions(FillBasisTypeEnum)
	const defaultValue = { basis: design.fill.basis || '' }
	let isHydrated = useHydrated()
	const fetcher = useFetcher<typeof action>()

	return (
		<FetcherSelect
			fetcher={fetcher}
			isHydrated={isHydrated}
			schema={schema}
			route={route}
			formId={formId}
			defaultValue={defaultValue}
			options={options}
			tooltipText="Fill basis"
			placeholder="Select a basis"
			selectName="basis"
		>
			<div className="hidden">
				<input type="hidden" name="id" value={fillId} />
				<input
					type="hidden"
					name={EntityParentIdType.DESIGN_ID}
					value={designId}
				/>
			</div>
		</FetcherSelect>
	)
}
