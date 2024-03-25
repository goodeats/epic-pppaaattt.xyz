import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { type ChangeEvent, type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { quickToast } from '#app/components/toaster'
import { Input } from '#app/components/ui/input'
import { type IStroke } from '#app/models/stroke.server'
import { EditDesignStrokeValueSchema } from '#app/schema/stroke'
import { stringToHexcode, validateStringIsHexcode } from '#app/utils/colors'
import { useIsPending } from '#app/utils/misc'
import { DESIGN_STROKE_INTENT } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignStrokeEditValue = ({
	stroke,
}: {
	stroke: IStroke
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-artboard-design-edit-stroke-${stroke.id}`,
		constraint: getFieldsetConstraint(EditDesignStrokeValueSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...stroke,
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

			<input type="hidden" name="id" value={stroke.id} />
			<input type="hidden" name="designId" value={stroke.designId} />
			<input
				type="hidden"
				name="intent"
				value={DESIGN_STROKE_INTENT.updateDesignStrokeValue}
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
