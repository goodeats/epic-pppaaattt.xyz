import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { SidebarPanelButton } from '#app/components/templates/sidebar-panel-forms'
import { type ILayer } from '#app/models/layer.server'
import {
	type NewDesignSchemaType,
	type designTypeEnum,
} from '#app/schema/design'
import { type IArtboard } from '#app/utils/db.server'
import { useIsPending } from '#app/utils/misc'
import { type IntentDesignCreate } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignNew = ({
	type,
	artboardId,
	layerId,
	visibleDesignsCount,
	intent,
	schema,
}: {
	type: designTypeEnum
	artboardId?: IArtboard['id']
	layerId?: ILayer['id']
	visibleDesignsCount: number
	intent: IntentDesignCreate
	schema: NewDesignSchemaType
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const parent = artboardId ? 'artboard' : 'layer'
	const [form] = useForm({
		id: `panel-form-${parent}-design-new-${type}`,
		constraint: getFieldsetConstraint(schema),
		lastSubmission: actionData?.submission,
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			{artboardId && (
				<input type="hidden" name="artboardId" value={artboardId} />
			)}
			{layerId && <input type="hidden" name="layerId" value={layerId} />}
			<input type="hidden" name="type" value={type} />
			<input
				type="hidden"
				name="visibleDesignsCount"
				value={visibleDesignsCount}
			/>
			<input type="hidden" name="intent" value={intent} />

			<SidebarPanelButton
				type="submit"
				iconName="plus"
				iconText="Add New Design"
				disabled={isPending}
			/>
		</fetcher.Form>
	)
}
