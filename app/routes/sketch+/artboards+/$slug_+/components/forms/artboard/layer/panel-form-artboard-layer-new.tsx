import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { NewArtboardLayerSchema } from '#app/schema/layer-artboard'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../../../../intent'
import { type action } from '../../../../route'

export const PanelFormArtboardLayerNew = ({
	artboardId,
}: {
	artboardId: Artboard['id']
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: 'panel-form-artboard-layer-new',
		constraint: getFieldsetConstraint(NewArtboardLayerSchema),
		lastSubmission: actionData?.submission,
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="intent" value={INTENT.artboardCreateLayer} />
			<Button
				type="submit"
				variant="ghost"
				className="flex h-8 w-8 cursor-pointer items-center justify-center"
				disabled={isPending}
			>
				<Icon name="plus">
					<span className="sr-only">Add New</span>
				</Icon>
			</Button>
		</fetcher.Form>
	)
}
