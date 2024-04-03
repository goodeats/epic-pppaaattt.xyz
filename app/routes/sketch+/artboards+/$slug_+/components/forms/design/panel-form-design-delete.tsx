import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { SidebarPanelButton } from '#app/components/templates/sidebar-panel-forms'
import { type IDesignIdOrNull, type IDesign } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type DeleteDesignSchemaType } from '#app/schema/design'
import { type IArtboard } from '#app/utils/db.server'
import { useIsPending } from '#app/utils/misc'
import { type IntentDesignDelete } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignDelete = ({
	id,
	artboardId,
	layerId,
	isSelectedDesign,
	updateSelectedDesignId,
	intent,
	schema,
}: {
	id: IDesign['id']
	artboardId?: IArtboard['id']
	layerId?: ILayer['id']
	isSelectedDesign: boolean
	updateSelectedDesignId: IDesignIdOrNull
	intent: IntentDesignDelete
	schema: DeleteDesignSchemaType
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const parent = artboardId ? 'artboard' : 'layer'
	const [form] = useForm({
		id: `panel-form-${parent}-design-delete-${id}`,
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
			{isSelectedDesign && (
				<input
					type="hidden"
					name="isSelectedDesign"
					value={String(isSelectedDesign)}
				/>
			)}
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
				iconName="minus"
				iconText="Delete Design"
				disabled={isPending}
			/>
		</fetcher.Form>
	)
}
