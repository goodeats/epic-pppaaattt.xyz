import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Input } from '#app/components/ui/input'
import { type ILayer } from '#app/models/layer.server'
import { EditArtboardLayerNameSchema } from '#app/schema/layer'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardLayerEditName = ({
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
		id: `panel-form-artboard-design-edit-layer-${layer.id}`,
		constraint: getFieldsetConstraint(EditArtboardLayerNameSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...layer,
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

			<input type="hidden" name="id" value={layer.id} />
			<input type="hidden" name="artboardId" value={artboardId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.artboardUpdateLayerName}
			/>
			<Input
				type="text"
				maxLength={40}
				className={'flex h-8'}
				onBlur={e => handleSubmit(e)}
				disabled={isPending}
				{...conform.input(fields.name, {
					ariaAttributes: true,
				})}
			/>
		</fetcher.Form>
	)
}
