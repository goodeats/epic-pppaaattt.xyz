import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Input } from '#app/components/ui/input'
import { type IRotate } from '#app/models/rotate.server'
import { EditArtboardRotateSchema } from '#app/schema/rotate'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardDesignEditRotate = ({
	artboardId,
	rotate,
}: {
	artboardId: Artboard['id']
	rotate: IRotate
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-artboard-design-edit-rotate-${rotate.id}`,
		constraint: getFieldsetConstraint(EditArtboardRotateSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...rotate,
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

			<input type="hidden" name="id" value={rotate.id} />
			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="designId" value={rotate.designId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.artboardUpdateDesignRotate}
			/>
			<Input
				type="float"
				className={'flex h-8'}
				onBlur={e => handleSubmit(e)}
				autoComplete="off"
				disabled={isPending}
				{...conform.input(fields.rotation, {
					ariaAttributes: true,
				})}
			/>
		</fetcher.Form>
	)
}
