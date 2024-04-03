import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { SidebarPanelButton } from '#app/components/templates/sidebar-panel-forms'
import { type IDesignIdOrNull, type IDesign } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type ReorderDesignSchemaType } from '#app/schema/design'
import { useIsPending } from '#app/utils/misc'
import { type IntentDesignReorder } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignReorder = ({
	id,
	artboardId,
	layerId,
	panelIndex,
	panelCount,
	direction,
	updateSelectedDesignId,
	intent,
	schema,
}: {
	id: IDesign['id']
	artboardId?: ILayer['id']
	layerId?: ILayer['id']
	panelIndex: number
	panelCount: number
	direction: 'up' | 'down'
	updateSelectedDesignId: IDesignIdOrNull
	intent: IntentDesignReorder
	schema: ReorderDesignSchemaType
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const atTop = panelIndex === 0 && direction === 'up'
	const atBottom = panelIndex === panelCount - 1 && direction === 'down'

	const parent = artboardId ? 'artboard' : 'layer'
	const [form] = useForm({
		id: `panel-form-${parent}-design-reorder-${id}-${direction}`,
		constraint: getFieldsetConstraint(schema),
		lastSubmission: actionData?.submission,
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={id} />
			{artboardId && (
				<input type="hidden" name="artboardId" value={artboardId} />
			)}
			{layerId && <input type="hidden" name="layerId" value={layerId} />}
			<input type="hidden" name="direction" value={direction} />
			{updateSelectedDesignId && (
				<input
					type="hidden"
					name="updateSelectedDesignId"
					value={updateSelectedDesignId}
				/>
			)}
			<input type="hidden" name="intent" value={intent} />

			<SidebarPanelButton
				type="submit"
				iconName={`chevron-${direction}`}
				iconText={`Move ${direction}`}
				disabled={isPending || atTop || atBottom}
			/>
		</fetcher.Form>
	)
}
