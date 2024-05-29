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
import { type IDesign } from '#app/models/design/design.server'
import { validateArtworkVersionToggleVisibeDesignSubmission } from '#app/models/design-artwork-version/design-artwork-version.update.server'
import { ToggleVisibleArtworkVersionDesignSchema } from '#app/schema/design-artwork-version'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { artworkVersionDesignToggleVisibleService } from '#app/services/artwork/version/design/toggle-visible.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK_VERSION.DESIGN.UPDATE.VISIBLE
const schema = ToggleVisibleArtworkVersionDesignSchema

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
		await validateArtworkVersionToggleVisibeDesignSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await artworkVersionDesignToggleVisibleService({
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

export const ArtworkVersionDesignToggleVisible = ({
	design,
	version,
}: {
	design: IDesign
	version: IArtworkVersion
}) => {
	const versionId = version.id
	const designId = design.id
	const isVisible = design.visible
	const icon = isVisible ? 'eye-open' : 'eye-closed'
	const iconText = `${isVisible ? 'Hide' : 'Show'} ${design.type}`

	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form] = useForm({
		id: `artwork-version-design-toggle-visible-${versionId}-${designId}`,
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

			<TooltipHydrated tooltipText={iconText} isHydrated={isHydrated}>
				<PanelIconButton
					type="submit"
					iconName={icon}
					iconText={iconText}
					disabled={isPending}
				/>
			</TooltipHydrated>
		</fetcher.Form>
	)
}
