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
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { validateArtworkVersionSelectLayerSubmission } from '#app/models/layer-artwork-version/layer-artwork-version.update.server'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { SelectArtworkVersionLayerSchema } from '#app/schema/layer-artwork-version'
import { artworkVersionLayerSelectService } from '#app/services/artwork/version/layer/select.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK_VERSION.LAYER.UPDATE.SELECTED
const schema = SelectArtworkVersionLayerSchema

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let updateSuccess = false
	const { status, submission } =
		await validateArtworkVersionSelectLayerSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await artworkVersionLayerSelectService({
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

export const ArtworkVersionLayerToggleSelected = ({
	layer,
	version,
}: {
	layer: ILayer
	version: IArtworkVersion
}) => {
	const versionId = version.id
	const layerId = layer.id
	const isSelected = layer.selected
	const icon = isSelected ? 'crosshair-2' : 'crosshair-1'
	const iconText = `${isSelected ? 'Deselect' : 'Select'} layer`
	const tooltipText = `Edit ${isSelected ? 'artwork' : layer.name} designs`
	const className = isSelected ? 'bg-primary text-primary-foreground' : ''

	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form] = useForm({
		id: `artwork-version-layer-toggle-selected-${versionId}-new`,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
	})

	return (
		<fetcher.Form method="POST" action={route} {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			<input type="hidden" name="id" value={layerId} />
			<input
				type="hidden"
				name={EntityParentIdType.ARTWORK_VERSION_ID}
				value={versionId}
			/>

			<TooltipHydrated tooltipText={tooltipText} isHydrated={isHydrated}>
				<PanelIconButton
					type="submit"
					iconName={icon}
					iconText={iconText}
					disabled={isPending}
					className={className}
				/>
			</TooltipHydrated>
		</fetcher.Form>
	)
}
