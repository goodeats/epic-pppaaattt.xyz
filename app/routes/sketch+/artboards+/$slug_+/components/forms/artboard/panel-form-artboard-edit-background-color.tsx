import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { type ChangeEvent, type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { quickToast } from '#app/components/toaster'
import { Input } from '#app/components/ui/input'
import { type PickedArtboardType } from '#app/models/artboard.server'
import { ArtboardBackgroundColorSchema } from '#app/schema/artboard'
import { stringToHexcode, validateStringIsHexcode } from '#app/utils/colors'
import { useIsPending } from '#app/utils/misc'
import { ARTBOARD_INTENT } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormArtboardEditBackgroundColor = ({
	artboard,
}: {
	artboard: Pick<PickedArtboardType, 'id' | 'backgroundColor'>
}) => {
	const fetcher = useFetcher<typeof action>()

	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	const [form, fields] = useForm({
		id: 'panel-form-artboard-background',
		constraint: getFieldsetConstraint(ArtboardBackgroundColorSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...artboard,
		},
	})

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const parsedValue = stringToHexcode.parse(event.target.value)
		event.target.value = parsedValue
	}

	const handleSubmit = (event: FocusEvent<HTMLInputElement>) => {
		const isHexcode = validateStringIsHexcode(event.target.value)
		if (!isHexcode) {
			event.target.value = fields.backgroundColor.defaultValue || ''
			quickToast({
				type: 'error',
				title: 'Invalid color',
				description: 'Please enter a valid color hexcode',
			})
			return
		}

		fetcher.submit(event.currentTarget.form, {
			method: 'POST',
		})
	}

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={artboard.id} />
			<input
				type="hidden"
				name="intent"
				value={ARTBOARD_INTENT.updateArtboardBackgroundColor}
			/>
			<div className="flex w-full items-center space-x-2">
				<Input
					pattern="[A-F0-9]{6}"
					maxLength={6}
					className="flex h-8"
					onChange={e => handleChange(e)}
					onBlur={e => handleSubmit(e)}
					disabled={isPending}
					{...conform.input(fields.backgroundColor, {
						ariaAttributes: true,
					})}
				/>
			</div>
		</fetcher.Form>
	)
}
