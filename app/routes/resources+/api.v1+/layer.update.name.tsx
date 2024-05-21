import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import {
	type LoaderFunctionArgs,
	json,
	type DataFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useRef } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { Input } from '#app/components/ui/input'
import { type ILayer } from '#app/models/layer/layer.server'
import {
	updateLayerName,
	validateLayerNameSubmission,
} from '#app/models/layer/layer.update.server'
import { validateNoJS } from '#app/schema/form-data'
import { EditLayerNameSchema } from '#app/schema/layer'
import { requireUserId } from '#app/utils/auth.server'
import { useDebounce, useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.LAYER.UPDATE.NAME
const schema = EditLayerNameSchema

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let updateSuccess = false
	const { status, submission } = await validateLayerNameSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success } = await updateLayerName({
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

export const LayerName = ({
	layer,
	formLocation = '',
}: {
	layer: ILayer
	formLocation?: string
}) => {
	const layerId = layer.id
	const formId = `layer-update-name-${layerId}${
		formLocation ? `-${formLocation}` : ''
	}`

	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form, fields] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
		shouldValidate: 'onInput',
		shouldRevalidate: 'onInput',
		onValidate: ({ formData }) => {
			return parse(formData, { schema: schema })
		},
		onSubmit: async (event, { formData }) => {
			event.preventDefault()
			fetcher.submit(formData, {
				method: 'POST',
				action: route,
			})
		},
		defaultValue: {
			name: layer.name || '',
		},
	})
	const submitRef = useRef<HTMLButtonElement>(null)

	const handleChangeSubmit = useDebounce((f: HTMLFormElement) => {
		submitRef.current?.click()
	}, 400)

	return (
		<fetcher.Form
			method="POST"
			action={route}
			onChange={e => handleChangeSubmit(e.currentTarget)}
			{...form.props}
		>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			<input type="hidden" name="id" value={layerId} />

			<Input
				className="flex h-8"
				disabled={isPending}
				{...conform.input(fields.name, {
					ariaAttributes: true,
				})}
			/>

			{/* form onChange click this to trigger useForm */}
			<button type="submit" ref={submitRef} style={{ display: 'none' }}>
				Submit
			</button>
		</fetcher.Form>
	)
}
