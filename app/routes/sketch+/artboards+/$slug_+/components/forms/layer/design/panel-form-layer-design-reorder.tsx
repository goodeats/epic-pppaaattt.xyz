import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { type ILayer } from '#app/models/layer.server'
import { ReorderLayerDesignSchema } from '#app/schema/design-layer'
import { useIsPending } from '#app/utils/misc'
import { LAYER_DESIGN_INTENT } from '../../../../intent'
import { type action } from '../../../../route'

export const PanelFormLayerDesignReorder = ({
	id,
	layerId,
	panelIndex,
	panelCount,
	direction,
	updateSelectedDesignId,
}: {
	id: string
	layerId: ILayer['id']
	panelIndex: number
	panelCount: number
	direction: 'up' | 'down'
	updateSelectedDesignId: string | null | undefined
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const atTop = panelIndex === 0 && direction === 'up'
	const atBottom = panelIndex === panelCount - 1 && direction === 'down'

	const [form] = useForm({
		id: `panel-form-layer-design-reorder-${id}-${direction}`,
		constraint: getFieldsetConstraint(ReorderLayerDesignSchema),
		lastSubmission: actionData?.submission,
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={id} />
			<input type="hidden" name="layerId" value={layerId} />
			<input type="hidden" name="direction" value={direction} />
			{updateSelectedDesignId && (
				<input
					type="hidden"
					name="updateSelectedDesignId"
					value={updateSelectedDesignId}
				/>
			)}
			<input
				type="hidden"
				name="intent"
				value={LAYER_DESIGN_INTENT.layerReorderDesign}
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
