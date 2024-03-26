import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Input } from '#app/components/ui/input'
import { type ISize } from '#app/models/size.server'
import { EditDesignSizeValueSchema } from '#app/schema/size'
import { useIsPending } from '#app/utils/misc'
import { DESIGN_SIZE_INTENT } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignSizeEditValue = ({ size }: { size: ISize }) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-design-size-edit-${size.id}-value`,
		constraint: getFieldsetConstraint(EditDesignSizeValueSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...size,
		},
	})

	const handleSubmit = (event: FocusEvent<HTMLInputElement>) => {
		fetcher.submit(event.currentTarget.form, {
			method: 'POST',
		})
	}

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={size.id} />
			<input type="hidden" name="designId" value={size.designId} />
			<input
				type="hidden"
				name="intent"
				value={DESIGN_SIZE_INTENT.updateDesignSizeValue}
			/>
			<Input
				type="number"
				min={0}
				className={
					'flex h-8 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
				}
				onBlur={e => handleSubmit(e)}
				disabled={isPending}
				{...conform.input(fields.value, {
					ariaAttributes: true,
				})}
			/>
		</fetcher.Form>
	)
}
