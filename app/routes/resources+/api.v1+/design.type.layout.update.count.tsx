import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherNumber } from '#app/components/templates/form/fetcher-number'
import { type IDesignWithLayout } from '#app/models/design/design.server'
import { validateDesignTypeUpdateLayoutCountSubmission } from '#app/models/design-type/layout/layout.update.server'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { EditDesignLayoutCountSchema } from '#app/schema/layout'
import { updateDesignTypeLayoutCountService } from '#app/services/design-type/update-layout.service'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.DESIGN.TYPE.LAYOUT.UPDATE.COUNT
const schema = EditDesignLayoutCountSchema

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
		await validateDesignTypeUpdateLayoutCountSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await updateDesignTypeLayoutCountService({
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

export const DesignTypeLayoutCount = ({
	design,
	formLocation,
}: {
	design: IDesignWithLayout
	formLocation?: string
}) => {
	const designId = design.id
	const layoutId = design.layout.id
	const field = 'count'
	const fetcherKey = `design-type-layout-update-${field}-${designId}-${layoutId}`
	const formId = `${fetcherKey}${formLocation ? `-${formLocation}` : ''}`
	const value = design.layout[field]

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
			selectName={field}
			selectValue={value}
			tooltipText={`Layout ${field}`}
			isHydrated={isHydrated}
			placeholder={`Set ${field}`}
		>
			<div className="hidden">
				<input type="hidden" name="id" value={layoutId} />
				<input
					type="hidden"
					name={EntityParentIdType.DESIGN_ID}
					value={designId}
				/>
			</div>
		</FetcherNumber>
	)
}
