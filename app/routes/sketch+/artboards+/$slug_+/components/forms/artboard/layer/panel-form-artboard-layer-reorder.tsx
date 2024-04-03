import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { type ILayer } from '#app/models/layer.server'
import { ReorderArtboardLayerSchema } from '#app/schema/layer-artboard'
import { useIsPending } from '#app/utils/misc'
import { ARTBOARD_LAYER_INTENT } from '../../../../intent'
import { type action } from '../../../../route'

export const PanelFormArtboardLayerReorder = ({
	id,
	artboardId,
	panelIndex,
	panelCount,
	direction,
}: {
	id: ILayer['id']
	artboardId: Artboard['id']
	panelIndex: number
	panelCount: number
	direction: 'up' | 'down'
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const atTop = panelIndex === 0 && direction === 'up'
	const atBottom = panelIndex === panelCount - 1 && direction === 'down'

	const [form] = useForm({
		id: `panel-form-artboard-layer-reorder-${id}-${direction}`,
		constraint: getFieldsetConstraint(ReorderArtboardLayerSchema),
		lastSubmission: actionData?.submission,
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={id} />
			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="direction" value={direction} />
			<input
				type="hidden"
				name="intent"
				value={ARTBOARD_LAYER_INTENT.artboardReorderLayer}
			/>

			<PanelIconButton
				type="submit"
				iconName={`chevron-${direction}`}
				iconText={`Move ${direction}`}
				disabled={isPending || atTop || atBottom}
			/>
		</fetcher.Form>
	)
}
