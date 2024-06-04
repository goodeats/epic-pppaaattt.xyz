import { useForm, conform } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type FetcherWithComponents } from '@remix-run/react'
import { useRef } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { type z } from 'zod'
import { Input } from '#app/components/ui/input'
import { useOptimisticValue } from '#app/utils/forms'
import { useDebounce, useIsPending } from '#app/utils/misc'
import { TooltipHydrated } from '../tooltip'

export const FetcherHex = ({
	fetcher,
	fetcherKey,
	route,
	schema,
	formId,
	selectName,
	selectValue,
	placeholder,
	tooltipText,
	isHydrated,
	children,
}: {
	fetcher: FetcherWithComponents<any>
	fetcherKey: string
	route: string
	schema: z.ZodSchema<any>
	formId: string
	selectName: string
	selectValue: string
	placeholder: string
	tooltipText: string
	isHydrated: boolean
	children: JSX.Element
}) => {
	const optimisticValue = useOptimisticValue(fetcherKey, schema, selectName)
	const value = optimisticValue ?? selectValue ?? 0
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	const [form, fields] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
		shouldValidate: 'onInput',
		shouldRevalidate: 'onInput',
		onValidate: ({ formData }) => {
			// set hex chars to uppercase
			const value = formData.get(selectName)
			if (typeof value === 'string') {
				formData.set(selectName, value.toUpperCase())
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
			[selectName]: value,
		},
	})

	// hack to submit select form on change
	// through conform-to and fetcher
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
			className="flex-1"
		>
			<AuthenticityTokenInput />
			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			{/* hidden field values */}
			{children}

			<TooltipHydrated tooltipText={tooltipText} isHydrated={isHydrated}>
				<Input
					maxLength={6}
					className="flex h-8"
					onInput={e => handleInput(e.currentTarget)}
					placeholder={placeholder}
					disabled={isPending}
					{...conform.input(fields[selectName], {
						ariaAttributes: true,
					})}
				/>
			</TooltipHydrated>

			<button type="submit" ref={submitRef} className="hidden">
				Submit
			</button>
		</fetcher.Form>
	)
}
