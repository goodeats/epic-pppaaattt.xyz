import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { type z } from 'zod'
import { Icon, type IconName } from '#app/components/ui/icon'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { useDebounce, useIsPending } from '#app/utils/misc'
import {
	type RoutePath,
	getLoaderType,
	getActionType,
} from '#app/utils/routes.utils'

type inputOptions = {
	min?: number
	max?: number
	step?: number
	placeholder?: string
	required?: boolean
}

export const FormFetcherNumber = ({
	entityId,
	defaultValue,
	route,
	formId,
	schema,
	icon,
	inputOptions,
}: {
	entityId: IArtboardVersionWithDesignsAndLayers['id']
	defaultValue: {
		[key: string]: number
	}
	route: RoutePath
	formId: string
	schema: z.ZodSchema<any>
	icon?: IconName
	inputOptions?: inputOptions
}) => {
	const loader = getLoaderType(route)
	const action = getActionType(route)
	const fetcher = useFetcher<typeof loader>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form, fields] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission: actionData?.submission,
		defaultValue,
	})
	const defaultValueKey = Object.keys(defaultValue)[0]
	const formField = fields[defaultValueKey]

	const handleChangeSubmit = useDebounce((form: HTMLFormElement) => {
		fetcher.submit(form)
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

			<div className="flex w-full items-center space-x-2">
				{icon && (
					<Label htmlFor={formField.id} className="w-5 flex-shrink-0">
						<Icon name={icon} className="h-5 w-5" />
					</Label>
				)}
				<Input
					type="number"
					className="flex h-8"
					disabled={isPending}
					{...conform.input(formField, {
						ariaAttributes: true,
					})}
				/>
			</div>
		</fetcher.Form>
	)
}
