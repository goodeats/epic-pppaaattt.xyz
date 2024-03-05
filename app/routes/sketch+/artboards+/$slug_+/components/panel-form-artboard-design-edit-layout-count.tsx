import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Input } from '#app/components/ui/input'
import { type ILayout } from '#app/models/layout.server'
import { EditArtboardLayoutCountSchema } from '#app/schema/layout'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardDesignEditLayoutCount = ({
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
		id: `panel-form-artboard-design-edit-layout-${layout.id}-count`,
		constraint: getFieldsetConstraint(EditArtboardLayoutCountSchema),
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
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={layout.id} />
			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="designId" value={layout.designId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.artboardUpdateDesignLayoutCount}
			/>
			<Input
				type="number"
				min={1}
				max={100_000}
				className={'flex h-8'}
				onBlur={e => handleSubmit(e)}
				autoComplete="off"
				disabled={isPending}
				{...conform.input(fields.count, {
					ariaAttributes: true,
				})}
			/>
		</fetcher.Form>
	)
}
