import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useRef } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { Input } from '#app/components/ui/input'
import { type IDesignWithStroke } from '#app/models/design/design.server'
import {
	updateDesignTypeStrokeValue,
	validateDesignTypeUpdateStrokeValueSubmission,
} from '#app/models/design-type/stroke/stroke.update.server'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { EditDesignStrokeValueSchema } from '#app/schema/stroke'
import { requireUserId } from '#app/utils/auth.server'
import { useDebounce, useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.DESIGN.TYPE.STROKE.UPDATE.VALUE
const schema = EditDesignStrokeValueSchema

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
		await validateDesignTypeUpdateStrokeValueSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await updateDesignTypeStrokeValue({
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

export const DesignTypeStrokeValue = ({
	design,
	formLocation = '',
}: {
	design: IDesignWithStroke
	formLocation?: string
}) => {
	const designId = design.id
	const strokeId = design.stroke.id
	const formId = `design-type-stroke-update-value-${designId}-${strokeId}${
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
			// set hex chars to uppercase
			const value = formData.get('value')
			if (typeof value === 'string') {
				formData.set('value', value.toUpperCase())
			}
			return parse(formData, { schema })
		},
		onSubmit: async (event, { formData }) => {
			event.preventDefault()
			fetcher.submit(formData, {
				method: 'POST',
				action: route,
			})
		},
		defaultValue: {
			value: design.stroke.value || '',
		},
	})
	const submitRef = useRef<HTMLButtonElement>(null)

	const handleChangeSubmit = useDebounce((f: HTMLFormElement) => {
		submitRef.current?.click()
	}, 400)

	// still do this until conform can change the value to uppercase
	// or fetcher can handle it, like with theme
	const handleInput = (input: HTMLInputElement) => {
		input.value = input.value.toUpperCase()
	}

	return (
		<fetcher.Form
			method="POST"
			action={route}
			onChange={e => handleChangeSubmit(e.currentTarget)}
			{...form.props}
		>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			<input type="hidden" name="id" value={strokeId} />
			<input
				type="hidden"
				name={EntityParentIdType.DESIGN_ID}
				value={designId}
			/>

			<Input
				maxLength={6}
				className="flex h-8"
				onInput={e => handleInput(e.currentTarget)}
				disabled={isPending}
				{...conform.input(fields.value, {
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
