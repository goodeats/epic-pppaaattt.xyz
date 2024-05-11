import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { useRef } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { type z } from 'zod'
import { Input } from '#app/components/ui/input'
import { actions } from '#app/routes/resources+/api.v1+/routes.server'
import {
	type IEntityParentId,
	type IEntityId,
	type entityParentIdTypeEnum,
} from '#app/schema/entity'
import { type defaultValueString } from '#app/schema/zod-helpers'
import { useDebounce, useIsPending } from '#app/utils/misc'
import { type RoutePath } from '#app/utils/routes.const'

export const FormFetcherText = ({
	entityId,
	defaultValue,
	parentId,
	parentTypeId,
	route,
	formId,
	schema,
}: {
	entityId: IEntityId
	defaultValue: defaultValueString
	parentId?: IEntityParentId
	parentTypeId?: entityParentIdTypeEnum
	route: RoutePath
	formId: string
	schema: z.ZodSchema<any>
}) => {
	const action = actions[route]
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const defaultValueKey = Object.keys(defaultValue)[0]
	const [form, fields] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission: actionData?.submission,
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
		defaultValue,
	})
	const submitRef = useRef<HTMLButtonElement>(null)
	const formField = fields[defaultValueKey]

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
			<input type="hidden" name="id" value={entityId} />
			{parentId && parentTypeId && (
				<input type="hidden" name={parentTypeId} value={parentId} />
			)}

			<Input
				className="flex h-8"
				disabled={isPending}
				{...conform.input(formField, {
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
