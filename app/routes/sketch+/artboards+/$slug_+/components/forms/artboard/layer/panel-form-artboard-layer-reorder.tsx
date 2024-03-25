import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
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
			<Button
				type="submit"
				variant="ghost"
				className="flex h-4 w-4 cursor-pointer items-center justify-center"
				disabled={isPending || atTop || atBottom}
			>
				<Icon name={`chevron-${direction}`}>
					<span className="sr-only">Move {direction}</span>
				</Icon>
			</Button>
		</fetcher.Form>
	)
}
