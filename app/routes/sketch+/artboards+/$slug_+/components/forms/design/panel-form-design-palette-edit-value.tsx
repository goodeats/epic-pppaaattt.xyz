import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { type ChangeEvent, type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { quickToast } from '#app/components/toaster'
import { Input } from '#app/components/ui/input'
import { type IPalette } from '#app/models/palette.server'
import { EditDesignPaletteValueSchema } from '#app/schema/palette'
import { stringToHexcode, validateStringIsHexcode } from '#app/utils/colors'
import { useIsPending } from '#app/utils/misc'
import { DESIGN_PALETTE_INTENT } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignPaletteEditValue = ({
	palette,
}: {
	palette: IPalette
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-artboard-design-edit-palette-${palette.id}`,
		constraint: getFieldsetConstraint(EditDesignPaletteValueSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...palette,
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

			<input type="hidden" name="id" value={palette.id} />
			<input type="hidden" name="designId" value={palette.designId} />
			<input
				type="hidden"
				name="intent"
				value={DESIGN_PALETTE_INTENT.updateDesignPaletteValue}
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
