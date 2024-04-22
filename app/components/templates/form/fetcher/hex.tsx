import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { type ChangeEvent, type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { quickToast } from '#app/components/toaster'
import { Input } from '#app/components/ui/input'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { ArtboardVersionBackgroundSchema } from '#app/schema/artboard-version'
import { stringToHexcode, validateStringIsHexcode } from '#app/utils/colors'
import { useDebounce, useIsPending } from '#app/utils/misc'
import {
	type RoutePath,
	getLoaderType,
	getActionType,
} from '#app/utils/routes.utils'

// create a shared hex fetcher form
// import loader and action
// or enum if that can't be done

export const FormFetcherHex = ({
	entity,
	route,
	formId,
}: {
	entity: IArtboardVersionWithDesignsAndLayers
	route: RoutePath
	formId: string
}) => {
	const loader = getLoaderType(route)
	const action = getActionType(route)
	const backgroundFetcher = useFetcher<typeof loader>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form, fields] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(ArtboardVersionBackgroundSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...entity,
		},
	})

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const parsedValue = stringToHexcode.parse(event.target.value)
		event.target.value = parsedValue
	}

	const handleSubmit = (event: FocusEvent<HTMLInputElement>) => {
		const isHexcode = validateStringIsHexcode(event.target.value)
		if (!isHexcode) {
			event.target.value = fields.background.defaultValue || ''
			quickToast({
				type: 'error',
				title: 'Invalid color',
				description: 'Please enter a valid color hexcode',
			})
			return
		}

		backgroundFetcher.submit(event.currentTarget.form)
	}
	const handleChangeSubmit = useDebounce((form: HTMLFormElement) => {
		// debugger
		// backgroundFetcher.submit(form)
	}, 400)

	return (
		<backgroundFetcher.Form
			method="POST"
			action={route}
			onChange={e => handleChangeSubmit(e.currentTarget)}
			{...form.props}
		>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			<input type="hidden" name="id" value={entity.id} />

			<Input
				pattern="[A-F0-9]{6}"
				maxLength={6}
				className="flex h-8"
				onChange={e => handleChange(e)}
				onBlur={e => handleSubmit(e)}
				disabled={isPending}
				{...conform.input(fields.background, {
					ariaAttributes: true,
				})}
			/>
		</backgroundFetcher.Form>
	)
}
