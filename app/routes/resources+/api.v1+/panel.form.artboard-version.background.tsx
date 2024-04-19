import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import {
	type LoaderFunctionArgs,
	json,
	type DataFunctionArgs,
} from '@remix-run/node'
import { useActionData, useFetcher } from '@remix-run/react'
import { type ChangeEvent, type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { quickToast } from '#app/components/toaster'
import { Input } from '#app/components/ui/input'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { ArtboardVersionBackgroundSchema } from '#app/schema/artboard-version'
import { validateNoJS } from '#app/schema/form-data'
import { updateArtboardVersionBackgroundService } from '#app/services/artboard/version/update.service'
import { requireUserId } from '#app/utils/auth.server'
import { stringToHexcode, validateStringIsHexcode } from '#app/utils/colors'
import { useIsPending } from '#app/utils/misc'

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

const actionPath = '/resources/api/v1/panel/form/artboard-version/background'
export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	const { status, submission } = await updateArtboardVersionBackgroundService({
		request,
		userId,
		formData,
	})

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission },
		{ status: status === 'error' ? 400 : 200 },
	)
}

export const PanelFormArtboardVersionBackground = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	const backgroundFetcher = useFetcher<typeof loader>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form, fields] = useForm({
		id: 'panel-form-artboard-version-background',
		constraint: getFieldsetConstraint(ArtboardVersionBackgroundSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...version,
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

		backgroundFetcher.submit(event.currentTarget.form, {
			method: 'POST',
			action: actionPath,
		})
	}

	return (
		<backgroundFetcher.Form action={actionPath} method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			<input type="hidden" name="id" value={version.id} />
			<input type="hidden" name="intent" value="update-background" />

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
