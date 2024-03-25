import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { type ILayer } from '#app/models/layer.server'
import { type designTypeEnum } from '#app/schema/design'
import { NewLayerDesignSchema } from '#app/schema/design-layer'
import { useIsPending } from '#app/utils/misc'
import { LAYER_DESIGN_INTENT } from '../../../../intent'
import { type action } from '../../../../route'

export const PanelFormLayerDesignNew = ({
	layerId,
	type,
	visibleDesignsCount,
}: {
	layerId: ILayer['id']
	type: designTypeEnum
	visibleDesignsCount: number
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: `panel-form-layer-design-new-${type}`,
		constraint: getFieldsetConstraint(NewLayerDesignSchema),
		lastSubmission: actionData?.submission,
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="layerId" value={layerId} />
			<input type="hidden" name="type" value={type} />
			<input
				type="hidden"
				name="visibleDesignsCount"
				value={visibleDesignsCount}
			/>
			<input
				type="hidden"
				name="intent"
				value={LAYER_DESIGN_INTENT.layerCreateDesign}
			/>

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
