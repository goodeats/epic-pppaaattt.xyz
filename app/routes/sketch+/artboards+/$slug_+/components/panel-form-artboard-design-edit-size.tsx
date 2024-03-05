import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Input } from '#app/components/ui/input'
import { type ISize } from '#app/models/size.server'
import { EditArtboardPaletteSchema } from '#app/schema/palette'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardDesignEditSize = ({
	artboardId,
	size,
}: {
	artboardId: Artboard['id']
	size: ISize
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-artboard-design-edit-size-${size.id}`,
		constraint: getFieldsetConstraint(EditArtboardPaletteSchema),
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
			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="designId" value={size.designId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.artboardUpdateDesignSize}
			/>
			<Input
				type="number"
				className={'flex h-8'}
				onBlur={e => handleSubmit(e)}
				disabled={isPending}
				{...conform.input(fields.value, {
					ariaAttributes: true,
				})}
			/>
		</fetcher.Form>
	)
}
