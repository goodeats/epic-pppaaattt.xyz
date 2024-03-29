import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { type ChangeEvent, type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { quickToast } from '#app/components/toaster'
import { Input } from '#app/components/ui/input'
import { type IFill } from '#app/models/fill.server'
import { EditDesignFillValueSchema } from '#app/schema/fill'
import { stringToHexcode, validateStringIsHexcode } from '#app/utils/colors'
import { useIsPending } from '#app/utils/misc'
import { DESIGN_FILL_INTENT } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignFillEditValue = ({ fill }: { fill: IFill }) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-design-fill-edit-${fill.id}-value`,
		constraint: getFieldsetConstraint(EditDesignFillValueSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...fill,
		},
	})

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const parsedValue = stringToHexcode.parse(event.target.value)
		event.target.value = parsedValue
	}

	const handleSubmit = (event: FocusEvent<HTMLInputElement>) => {
		const isHexcode = validateStringIsHexcode(event.target.value)
		if (!isHexcode) {
			event.target.value = fields.value.defaultValue || ''
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

			<input type="hidden" name="id" value={fill.id} />
			<input type="hidden" name="designId" value={fill.designId} />
			<input
				type="hidden"
				name="intent"
				value={DESIGN_FILL_INTENT.updateDesignFillValue}
			/>
			<Input
				type="text"
				pattern="[A-F0-9]{6}"
				maxLength={6}
				className={'flex h-8'}
				onChange={e => handleChange(e)}
				onBlur={e => handleSubmit(e)}
				disabled={isPending}
				{...conform.input(fields.value, {
					ariaAttributes: true,
				})}
			/>
		</fetcher.Form>
	)
}
