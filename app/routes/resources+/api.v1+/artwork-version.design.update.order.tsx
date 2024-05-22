import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { type IconName } from '#app/components/ui/icon'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type IDesign } from '#app/models/design/design.server'
import { validateArtworkVersionReorderDesignSubmission } from '#app/models/design-artwork-version/design-artwork-version.update.server'
import { ReorderArtworkVersionDesignSchema } from '#app/schema/design-artwork-version'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { artworkVersionDesignMoveDownService } from '#app/services/artwork/version/design/move-down.service'
import { artworkVersionDesignMoveUpService } from '#app/services/artwork/version/design/move-up.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK_VERSION.DESIGN.UPDATE.ORDER
const schema = ReorderArtworkVersionDesignSchema

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let updateSuccess = false
	const { status, submission } =
		await validateArtworkVersionReorderDesignSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { direction } = submission.value
		const { success } =
			direction === 'up'
				? await artworkVersionDesignMoveUpService({
						userId,
						...submission.value,
					})
				: await artworkVersionDesignMoveDownService({
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

export const ArtworkVersionDesignReorder = ({
	design,
	version,
	direction,
	atTopOrBottom = false,
}: {
	design: IDesign
	version: IArtworkVersion
	direction: 'up' | 'down'
	atTopOrBottom?: boolean
}) => {
	const versionId = version.id
	const designId = design.id
	const icon = `chevron-${direction}`
	const iconText = `Move ${direction}`
	const formId = `artwork-version-design-reorder-${direction}-${versionId}-${designId}`

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
			<input
				type="hidden"
				name={EntityParentIdType.ARTWORK_VERSION_ID}
				value={versionId}
			/>
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
