import { useForm, conform } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type FetcherWithComponents } from '@remix-run/react'
import { useRef } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { type z } from 'zod'
import { Input } from '#app/components/ui/input'
import { useOptimisticValue } from '#app/utils/forms'
import { cn, useDebounce, useIsPending } from '#app/utils/misc'
import { TooltipHydrated } from '../tooltip'

export const FetcherNumber = ({
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
	selectValue: number
	placeholder: string
	tooltipText: string
	isHydrated: boolean
	children: JSX.Element
}) => {
	const optimisticValue = useOptimisticValue(fetcherKey, schema, selectName)
	const value = optimisticValue ?? selectValue ?? ''
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	const [form, fields] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
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
			[selectName]: value,
		},
	})

	// hack to submit select form on change
	// through conform-to and fetcher
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
			className="flex-1"
		>
			<AuthenticityTokenInput />
			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			{/* hidden field values */}
			{children}

			<TooltipHydrated tooltipText={tooltipText} isHydrated={isHydrated}>
				<Input
					type="number"
					className={cn(
						'flex h-8',
						// https://www.hyperui.dev/blog/remove-number-input-spinners-with-tailwindcss
						'[-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none',
					)}
					autoComplete="off"
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
