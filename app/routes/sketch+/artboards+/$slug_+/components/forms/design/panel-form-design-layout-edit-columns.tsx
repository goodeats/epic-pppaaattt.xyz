import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Input } from '#app/components/ui/input'
import { type ILayout } from '#app/models/design-type/layout/layout.server'
import { EditDesignLayoutColumnsSchema } from '#app/schema/layout'
import { useIsPending } from '#app/utils/misc'
import { DESIGN_LAYOUT_INTENT } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignLayoutEditColumns = ({
	layout,
}: {
	layout: ILayout
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-design-layout-edit-${layout.id}-columns`,
		constraint: getFieldsetConstraint(EditDesignLayoutColumnsSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...layout,
		},
	})

	const handleSubmit = (event: FocusEvent<HTMLInputElement>) => {
		fetcher.submit(event.currentTarget.form, {
			method: 'POST',
		})
	}

	return (
		<fetcher.Form
			method="POST"
			{...form.props}
			className={'col-span-2 flex h-8'}
		>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={layout.id} />
			<input type="hidden" name="designId" value={layout.designId} />
			<input
				type="hidden"
				name="intent"
				value={DESIGN_LAYOUT_INTENT.updateDesignLayoutColumns}
			/>
			<Input
				type="number"
				min={1}
				max={3_000}
				className={
					'flex h-8 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
				}
				onBlur={e => handleSubmit(e)}
				autoComplete="off"
				disabled={isPending}
				{...conform.input(fields.columns, {
					ariaAttributes: true,
				})}
			/>
		</fetcher.Form>
	)
}
