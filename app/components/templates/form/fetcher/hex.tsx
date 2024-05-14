import { type z } from 'zod'
import {
	type IEntityParentId,
	type IEntityId,
	type entityParentIdTypeEnum,
} from '#app/schema/entity'
import { type defaultValueString } from '#app/schema/zod-helpers'
import { type RoutePath } from '#app/utils/routes.const'

export const FormFetcherHex = ({
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
	return 'hex'
	// const fetcher = useFetcher<typeof action>()
	// const actionData = useActionData<typeof action>()
	// const isPending = useIsPending()
	// let isHydrated = useHydrated()
	// const defaultValueKey = Object.keys(defaultValue)[0]
	// const [form, fields] = useForm({
	// 	id: formId,
	// 	constraint: getFieldsetConstraint(schema),
	// 	lastSubmission: actionData?.submission,
	// 	shouldValidate: 'onInput',
	// 	shouldRevalidate: 'onInput',
	// 	onValidate: ({ formData }) => {
	// 		// set hex chars to uppercase
	// 		const value = formData.get(defaultValueKey)
	// 		if (typeof value === 'string') {
	// 			formData.set(defaultValueKey, value.toUpperCase())
	// 		}
	// 		return parse(formData, { schema })
	// 	},
	// 	onSubmit: async (event, { formData }) => {
	// 		event.preventDefault()
	// 		fetcher.submit(formData, {
	// 			method: 'POST',
	// 			action: route,
	// 		})
	// 	},
	// 	defaultValue,
	// })
	// const submitRef = useRef<HTMLButtonElement>(null)
	// const formField = fields[defaultValueKey]

	// const handleChangeSubmit = useDebounce((f: HTMLFormElement) => {
	// 	submitRef.current?.click()
	// }, 400)

	// // still do this until conform can change the value to uppercase
	// // or fetcher can handle it, like with theme
	// const handleInput = (input: HTMLInputElement) => {
	// 	input.value = input.value.toUpperCase()
	// }

	// return (
	// 	<fetcher.Form
	// 		method="POST"
	// 		action={route}
	// 		onChange={e => handleChangeSubmit(e.currentTarget)}
	// 		{...form.props}
	// 	>
	// 		<AuthenticityTokenInput />

	// 		<input type="hidden" name="no-js" value={String(!isHydrated)} />
	// 		<input type="hidden" name="id" value={entityId} />
	// 		{parentId && <input type="hidden" name={parentTypeId} value={parentId} />}

	// 		<Input
	// 			maxLength={6}
	// 			className="flex h-8"
	// 			onInput={e => handleInput(e.currentTarget)}
	// 			disabled={isPending}
	// 			{...conform.input(formField, {
	// 				ariaAttributes: true,
	// 			})}
	// 		/>

	// 		{/* form onChange click this to trigger useForm */}
	// 		<button type="submit" ref={submitRef} style={{ display: 'none' }}>
	// 			Submit
	// 		</button>
	// 	</fetcher.Form>
	// )
}
