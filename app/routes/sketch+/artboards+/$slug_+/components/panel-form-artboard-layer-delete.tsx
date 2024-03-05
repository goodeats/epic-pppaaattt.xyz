import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { FormDeleteIcon } from '#app/components/shared'
import { StatusButton } from '#app/components/ui/status-button'
import { DeleteArtboardLayerSchema } from '#app/schema/layer'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardLayerDelete = ({
	id,
	artboardId,
}: {
	id: string
	artboardId: Artboard['id']
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: `panel-form-artboard-layer-delete-${id}`,
		constraint: getFieldsetConstraint(DeleteArtboardLayerSchema),
		lastSubmission: actionData?.submission,
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={id} />
			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="intent" value={INTENT.artboardDeleteLayer} />
			<StatusButton
				type="submit"
				name="intent"
				value="delete-layer"
				variant="destructive"
				status={isPending ? 'pending' : actionData?.status ?? 'idle'}
				disabled={isPending}
			>
				<FormDeleteIcon />
			</StatusButton>
		</fetcher.Form>
	)
}
