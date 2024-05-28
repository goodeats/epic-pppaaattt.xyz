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
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { validateArtworkVersionNewLayerSubmission } from '#app/models/layer/layer.create.server'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { NewArtworkVersionLayerSchema } from '#app/schema/layer-artwork-version'
import { artworkVersionLayerCreateService } from '#app/services/artwork/version/layer/create.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK_VERSION.LAYER.CREATE
const schema = NewArtworkVersionLayerSchema

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let createSuccess = false
	const { status, submission } = await validateArtworkVersionNewLayerSubmission(
		{
			userId,
			formData,
		},
	)

	if (status === 'success') {
		const { success } = await artworkVersionLayerCreateService({
			userId,
			...submission.value,
		})
		createSuccess = success
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission },
		{
			status: status === 'error' || !createSuccess ? 422 : 201,
		},
	)
}

export const ArtworkVersionLayerCreate = ({
	versionId,
}: {
	versionId: IArtworkVersion['id']
}) => {
	const iconText = 'Add new layer'

	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form] = useForm({
		id: `artwork-version-layer-create-${versionId}-new`,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
	})

	return (
		<fetcher.Form method="POST" action={route} {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			<input
				type="hidden"
				name={EntityParentIdType.ARTWORK_VERSION_ID}
				value={versionId}
			/>

			{isHydrated ? (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<PanelIconButton
								type="submit"
								iconName="plus"
								iconText={iconText}
								disabled={isPending}
							/>
						</TooltipTrigger>
						<TooltipContent>{iconText}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			) : (
				<PanelIconButton
					type="submit"
					iconName="plus"
					iconText={iconText}
					disabled={isPending}
				/>
			)}
		</fetcher.Form>
	)
}
