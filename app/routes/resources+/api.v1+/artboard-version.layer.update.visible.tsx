import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { validateArtboardVersionToggleVisibeLayerSubmission } from '#app/models/layer-artboard-version/layer-artboard-version.update.server'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { ToggleVisibleArtboardVersionLayerSchema } from '#app/schema/layer-artboard-version'
import { artboardVersionLayerToggleVisibleService } from '#app/services/artboard/version/layer/toggle-visible.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.UPDATE.VISIBLE
const schema = ToggleVisibleArtboardVersionLayerSchema

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let updateSuccess = false
	const { status, submission } =
		await validateArtboardVersionToggleVisibeLayerSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await artboardVersionLayerToggleVisibleService({
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

export const ArtboardVersionLayerToggleVisible = ({
	layer,
	version,
}: {
	layer: ILayer
	version: IArtboardVersion
}) => {
	const versionId = version.id
	const layerId = layer.id
	const isVisible = layer.visible
	const icon = isVisible ? 'eye-open' : 'eye-closed'
	const iconText = isVisible ? 'Hide layer' : 'Show layer'

	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form] = useForm({
		id: `artboard-version-layer-toggle-visible-${versionId}-new`,
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
				name={EntityParentIdType.ARTBOARD_VERSION_ID}
				value={versionId}
			/>

			<PanelIconButton
				type="submit"
				iconName={icon}
				iconText={iconText}
				disabled={isPending}
			/>
		</fetcher.Form>
	)
}
