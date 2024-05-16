import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import {
	type LoaderFunctionArgs,
	json,
	type ActionFunctionArgs,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type IDesign } from '#app/models/design/design.server'
import { validateArtboardVersionToggleVisibeDesignSubmission } from '#app/models/design-artboard-version/design-artboard-version.update.server'
import { ToggleVisibleArtboardVersionDesignSchema } from '#app/schema/design-artboard-version'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { artboardVersionDesignToggleVisibleService } from '#app/services/artboard/version/design/toggle-visible.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.DESIGN.UPDATE.VISIBLE
const schema = ToggleVisibleArtboardVersionDesignSchema

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
		await validateArtboardVersionToggleVisibeDesignSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await artboardVersionDesignToggleVisibleService({
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

export const ArtboardVersionDesignToggleVisible = ({
	design,
	version,
}: {
	design: IDesign
	version: IArtboardVersion
}) => {
	const versionId = version.id
	const designId = design.id
	const isVisible = design.visible
	const icon = isVisible ? 'eye-open' : 'eye-closed'
	const iconText = isVisible ? 'Hide design' : 'Show design'

	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form] = useForm({
		id: `artboard-version-design-toggle-visible-${versionId}-new`,
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
