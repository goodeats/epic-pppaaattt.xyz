import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { TooltipHydrated } from '#app/components/templates/tooltip'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { type IDesign } from '#app/models/design/design.server'
import { validateLayerDeleteDesignSubmission } from '#app/models/design-layer/design-layer.delete.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { DeleteLayerDesignSchema } from '#app/schema/design-layer'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { layerDesignDeleteService } from '#app/services/layer/design/delete.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.LAYER.DESIGN.DELETE
const schema = DeleteLayerDesignSchema

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let deleteSuccess = false
	const { status, submission } = await validateLayerDeleteDesignSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success } = await layerDesignDeleteService({
			userId,
			...submission.value,
		})
		deleteSuccess = success
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission },
		{
			status: status === 'error' || !deleteSuccess ? 404 : 200,
		},
	)
}

export const LayerDesignDelete = ({
	design,
	layerId,
}: {
	design: IDesign
	layerId: ILayer['id']
}) => {
	const designId = design.id
	const iconText = `Delete ${design.type}`

	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	let isHydrated = useHydrated()

	const [form] = useForm({
		id: `layer-design-delete-${layerId}-${designId}`,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
	})

	return (
		<fetcher.Form method="POST" action={route} {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			<input type="hidden" name="id" value={designId} />
			<input type="hidden" name={EntityParentIdType.LAYER_ID} value={layerId} />

			<TooltipHydrated tooltipText={iconText} isHydrated={isHydrated}>
				<PanelIconButton
					type="submit"
					iconName="minus"
					iconText={iconText}
					disabled={isPending}
				/>
			</TooltipHydrated>
		</fetcher.Form>
	)
}
