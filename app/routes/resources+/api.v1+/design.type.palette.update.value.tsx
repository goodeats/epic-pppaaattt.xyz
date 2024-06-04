import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FetcherHex } from '#app/components/templates/form/fetcher-hex'
import { type IDesignWithPalette } from '#app/models/design/design.server'
import {
	updateDesignTypePaletteValue,
	validateDesignTypeUpdatePaletteValueSubmission,
} from '#app/models/design-type/palette/palette.update.server'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { EditDesignPaletteValueSchema } from '#app/schema/palette'
import { requireUserId } from '#app/utils/auth.server'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.DESIGN.TYPE.PALETTE.UPDATE.VALUE
const schema = EditDesignPaletteValueSchema

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
		await validateDesignTypeUpdatePaletteValueSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await updateDesignTypePaletteValue({
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

export const DesignTypePaletteValue = ({
	design,
	formLocation = '',
}: {
	design: IDesignWithPalette
	formLocation?: string
}) => {
	const designId = design.id
	const paletteId = design.palette.id
	const field = 'value'
	const fetcherKey = `design-type-palette-update-${field}-${designId}-${paletteId}`
	const formId = `${fetcherKey}${formLocation ? `-${formLocation}` : ''}`
	const value = design.palette[field]

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
			tooltipText={`Palette ${field}`}
			isHydrated={isHydrated}
			placeholder={`Select a ${field}`}
		>
			<div className="hidden">
				<input type="hidden" name="id" value={paletteId} />
				<input
					type="hidden"
					name={EntityParentIdType.DESIGN_ID}
					value={designId}
				/>
			</div>
		</FetcherHex>
	)
}
