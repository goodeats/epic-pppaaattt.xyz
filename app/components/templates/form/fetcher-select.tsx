import { useForm, conform } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type FetcherWithComponents } from '@remix-run/react'
import { useRef } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { type z } from 'zod'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '#app/components/ui/select'
import { useOptimisticValue } from '#app/utils/forms'
import { useIsPending } from '#app/utils/misc'
import { TooltipHydrated } from '../tooltip'

type Options = { [key: string]: string }[]

export const FetcherSelect = ({
	fetcher,
	fetcherKey,
	route,
	schema,
	formId,
	selectName,
	selectValue,
	options,
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
	options: Options
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
	const handleChangeSubmit = (f: HTMLFormElement) => {
		submitRef.current?.click()
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

			<Select disabled={isPending} {...conform.input(fields[selectName])}>
				<TooltipHydrated tooltipText={tooltipText} isHydrated={isHydrated}>
					<SelectTrigger className="flex h-8 flex-1 text-left">
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
				</TooltipHydrated>
				<SelectContent>
					{options.map(option => {
						const [value, label] = Object.entries(option)[0]
						return (
							<SelectItem key={label} value={value}>
								{label as string}
							</SelectItem>
						)
					})}
				</SelectContent>
			</Select>

			<button type="submit" ref={submitRef} className="hidden">
				Submit
			</button>
		</fetcher.Form>
	)
}
