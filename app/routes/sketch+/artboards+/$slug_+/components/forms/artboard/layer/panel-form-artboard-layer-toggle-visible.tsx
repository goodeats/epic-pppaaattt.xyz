import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { type ILayer } from '#app/models/layer.server'
import { ToggleVisibleArtboardLayerSchema } from '#app/schema/layer-artboard'
import { useIsPending } from '#app/utils/misc'
import { ARTBOARD_LAYER_INTENT } from '../../../../intent'
import { type action } from '../../../../route'

export const PanelFormArtboardLayerToggleVisible = ({
	id,
	artboardId,
	visible,
}: {
	id: ILayer['id']
	artboardId: Artboard['id']
	visible: boolean
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: `panel-form-artboard-layer-toggle-visible-${id}`,
		constraint: getFieldsetConstraint(ToggleVisibleArtboardLayerSchema),
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
				value={ARTBOARD_LAYER_INTENT.artboardToggleVisibleLayer}
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
