import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { validateArtworkVersionNewDesignSubmission } from '#app/models/design-artwork-version/design-artwork-version.create.server'
import { type designTypeEnum } from '#app/schema/design'
import { NewArtworkVersionDesignSchema } from '#app/schema/design-artwork-version'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { artworkVersionDesignCreateService } from '#app/services/artwork/version/design/create.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK_VERSION.DESIGN.CREATE
const schema = NewArtworkVersionDesignSchema

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let createSuccess = false
	const { status, submission } =
		await validateArtworkVersionNewDesignSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await artworkVersionDesignCreateService({
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

export const ArtworkVersionDesignCreate = ({
	type,
	versionId,
}: {
	type: designTypeEnum
	versionId: IArtworkVersion['id']
}) => {
	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form] = useForm({
		id: `artwork-version-design-create-${versionId}-new`,
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
			<input type="hidden" name="type" value={type} />

			<PanelIconButton
				type="submit"
				iconName="plus"
				iconText={`Add new ${type}`}
				disabled={isPending}
			/>
		</fetcher.Form>
	)
}
