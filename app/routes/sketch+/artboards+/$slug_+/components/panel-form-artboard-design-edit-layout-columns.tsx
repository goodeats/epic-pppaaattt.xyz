import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Input } from '#app/components/ui/input'
import { type ILayout } from '#app/models/layout.server'
import { EditArtboardLayoutColumnsSchema } from '#app/schema/layout'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardDesignEditLayoutColumns = ({
	artboardId,
	layout,
}: {
	artboardId: Artboard['id']
	layout: ILayout
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-artboard-design-edit-layout-${layout.id}-columns`,
		constraint: getFieldsetConstraint(EditArtboardLayoutColumnsSchema),
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
			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="designId" value={layout.designId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.artboardUpdateDesignLayoutColumns}
			/>
			<Input
				type="number"
				min={1}
				max={200}
				className={'flex h-8'}
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
