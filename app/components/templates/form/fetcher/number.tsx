import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { useRef } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { type z } from 'zod'
import { Icon, type IconName } from '#app/components/ui/icon'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import {
	type IEntityId,
	type IEntityParentId,
	type entityParentIdTypeEnum,
} from '#app/schema/entity'
import { type defaultValueNumber } from '#app/schema/zod-helpers'
import { useDebounce, useIsPending } from '#app/utils/misc'
import {
	type RoutePath,
	getLoaderType,
	getActionType,
} from '#app/utils/routes.utils'

export const FormFetcherNumber = ({
	entityId,
	defaultValue,
	parentId,
	parentTypeId,
	route,
	formId,
	schema,
	icon,
	label,
}: {
	entityId: IEntityId
	defaultValue: defaultValueNumber
	parentId?: IEntityParentId
	parentTypeId?: entityParentIdTypeEnum
	route: RoutePath
	formId: string
	schema: z.ZodSchema<any>
	icon?: IconName
	label?: string
}) => {
	const loader = getLoaderType(route)
	const action = getActionType(route)
	const fetcher = useFetcher<typeof loader>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form, fields] = useForm({
		id: `${formId}-${parentId}-${entityId}`,
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
	const defaultValueKey = Object.keys(defaultValue)[0]
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
			{parentId && <input type="hidden" name={parentTypeId} value={parentId} />}

			<div className="flex w-full items-center space-x-2">
				{icon && (
					<Label htmlFor={formField.id} className="w-5 flex-shrink-0">
						<Icon name={icon} className="h-5 w-5" />
					</Label>
				)}
				{label && <Label htmlFor={formField.id}>{label}</Label>}
				<Input
					type="number"
					// https://www.hyperui.dev/blog/remove-number-input-spinners-with-tailwindcss
					className="flex h-8 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
					autoComplete="off"
					disabled={isPending}
					{...conform.input(formField, {
						ariaAttributes: true,
					})}
				/>

				{/* form onChange click this to trigger useForm */}
				<button type="submit" ref={submitRef} style={{ display: 'none' }}>
					Submit
				</button>
			</div>
		</fetcher.Form>
	)
}
