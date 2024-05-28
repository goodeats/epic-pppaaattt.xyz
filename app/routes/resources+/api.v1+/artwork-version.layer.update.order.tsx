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
import { type IconName } from '#app/components/ui/icon'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { validateArtworkVersionReorderLayerSubmission } from '#app/models/layer-artwork-version/layer-artwork-version.update.server'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { ReorderArtworkVersionLayerSchema } from '#app/schema/layer-artwork-version'
import { artworkVersionLayerMoveDownService } from '#app/services/artwork/version/layer/move-down.service'
import { artworkVersionLayerMoveUpService } from '#app/services/artwork/version/layer/move-up.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK_VERSION.LAYER.UPDATE.ORDER
const schema = ReorderArtworkVersionLayerSchema

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
		await validateArtworkVersionReorderLayerSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { direction } = submission.value
		const { success } =
			direction === 'up'
				? await artworkVersionLayerMoveUpService({
						userId,
						...submission.value,
					})
				: await artworkVersionLayerMoveDownService({
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

export const ArtworkVersionLayerReorder = ({
	layer,
	version,
	direction,
	atTopOrBottom = false,
}: {
	layer: ILayer
	version: IArtworkVersion
	direction: 'up' | 'down'
	atTopOrBottom?: boolean
}) => {
	const versionId = version.id
	const layerId = layer.id
	const icon = `chevron-${direction}`
	const iconText = `Move ${direction}`
	const formId = `artwork-version-layer-reorder-${direction}-${versionId}-${layerId}`

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
			<input type="hidden" name="id" value={layerId} />
			<input
				type="hidden"
				name={EntityParentIdType.ARTWORK_VERSION_ID}
				value={versionId}
			/>
			<input type="hidden" name="direction" value={direction} />

			{isHydrated ? (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<PanelIconButton
								type="submit"
								iconName={icon as IconName}
								iconText={iconText}
								size="panel-sm"
								disabled={atTopOrBottom || isPending}
								className="my-0"
							/>
						</TooltipTrigger>
						<TooltipContent>{iconText}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			) : (
				<PanelIconButton
					type="submit"
					iconName={icon as IconName}
					iconText={iconText}
					size="panel-sm"
					disabled={atTopOrBottom || isPending}
					className="my-0"
				/>
			)}
		</fetcher.Form>
	)
}
