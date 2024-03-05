import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { ToggleVisibilityArtboardLayerSchema } from '#app/schema/layer'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardLayerToggleVisibility = ({
	id,
	artboardId,
	visible,
}: {
	id: string
	artboardId: Artboard['id']
	visible: boolean
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: `panel-form-artboard-layer-toggle-visibility-${id}`,
		constraint: getFieldsetConstraint(ToggleVisibilityArtboardLayerSchema),
		lastSubmission: actionData?.submission,
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={id} />
			<input type="hidden" name="artboardId" value={artboardId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.artboardToggleVisibilityLayer}
			/>
			<Button
				type="submit"
				variant="ghost"
				className="flex h-8 w-8 cursor-pointer items-center justify-center"
				disabled={isPending}
			>
				{visible ? (
					<Icon name="eye-open">
						<span className="sr-only">Hide</span>
					</Icon>
				) : (
					<Icon name="eye-closed">
						<span className="sr-only">Show</span>
					</Icon>
				)}
			</Button>
		</fetcher.Form>
	)
}
