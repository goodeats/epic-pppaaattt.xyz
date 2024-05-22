import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { type IconName } from '#app/components/ui/icon'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { type IDesign } from '#app/models/design/design.server'
import { validateLayerReorderDesignSubmission } from '#app/models/design-layer/design-layer.update.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { ReorderLayerDesignSchema } from '#app/schema/design-layer'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { layerDesignMoveDownService } from '#app/services/layer/design/move-down.service'
import { layerDesignMoveUpService } from '#app/services/layer/design/move-up.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.LAYER.DESIGN.UPDATE.ORDER
const schema = ReorderLayerDesignSchema

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let updateSuccess = false
	const { status, submission } = await validateLayerReorderDesignSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { direction } = submission.value
		const { success } =
			direction === 'up'
				? await layerDesignMoveUpService({
						userId,
						...submission.value,
				  })
				: await layerDesignMoveDownService({
						userId,
						...submission.value,
				  })
		updateSuccess = success
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission },
		{
			status: status === 'error' || !updateSuccess ? 404 : 200,
		},
	)
}

export const LayerDesignReorder = ({
	design,
	layer,
	direction,
	atTopOrBottom = false,
}: {
	design: IDesign
	layer: ILayer
	direction: 'up' | 'down'
	atTopOrBottom?: boolean
}) => {
	const layerId = layer.id
	const designId = design.id
	const icon = `chevron-${direction}`
	const iconText = `Move ${direction}`
	const formId = `layer-design-reorder-${direction}-${layerId}-${designId}`

	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
	})

	return (
		<fetcher.Form method="POST" action={route} {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			<input type="hidden" name="id" value={designId} />
			<input type="hidden" name={EntityParentIdType.LAYER_ID} value={layerId} />
			<input type="hidden" name="direction" value={direction} />

			<PanelIconButton
				type="submit"
				iconName={icon as IconName}
				iconText={iconText}
				size="panel-sm"
				disabled={atTopOrBottom || isPending}
				className="my-0"
			/>
		</fetcher.Form>
	)
}
