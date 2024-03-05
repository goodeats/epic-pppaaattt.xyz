import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Textarea } from '#app/components/ui/textarea'
import { type ILayer } from '#app/models/layer.server'
import { EditArtboardLayerDescriptionSchema } from '#app/schema/layer'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardLayerEditDescription = ({
	artboardId,
	layer,
}: {
	artboardId: Artboard['id']
	layer: ILayer
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-artboard-design-edit-layer-${layer.id}-description`,
		constraint: getFieldsetConstraint(EditArtboardLayerDescriptionSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...layer,
		},
	})

	const handleSubmit = (event: FocusEvent<HTMLTextAreaElement>) => {
		fetcher.submit(event.currentTarget.form, {
			method: 'POST',
		})
	}

	return (
		<fetcher.Form method="POST" {...form.props} className={'col-span-2 flex'}>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={layer.id} />
			<input type="hidden" name="artboardId" value={artboardId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.artboardUpdateLayerDescription}
			/>
			<Textarea
				maxLength={400}
				className={'flex'}
				onBlur={e => handleSubmit(e)}
				disabled={isPending}
				{...conform.textarea(fields.description, {
					ariaAttributes: true,
				})}
			/>
		</fetcher.Form>
	)
}
