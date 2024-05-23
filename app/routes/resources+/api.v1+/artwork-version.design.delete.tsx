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
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type IDesign } from '#app/models/design/design.server'
import { validateArtworkVersionDeleteDesignSubmission } from '#app/models/design-artwork-version/design-artwork-version.delete.server'
import { DeleteArtworkVersionDesignSchema } from '#app/schema/design-artwork-version'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { artworkVersionDesignDeleteService } from '#app/services/artwork/version/design/delete.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK_VERSION.DESIGN.DELETE
const schema = DeleteArtworkVersionDesignSchema

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let deleteSuccess = false
	const { status, submission } =
		await validateArtworkVersionDeleteDesignSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await artworkVersionDesignDeleteService({
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

export const ArtworkVersionDesignDelete = ({
	designId,
	versionId,
}: {
	designId: IDesign['id']
	versionId: IArtworkVersion['id']
}) => {
	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form] = useForm({
		id: `artwork-version-design-delete-${versionId}-${designId}`,
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

			<PanelIconButton
				type="submit"
				iconName="minus"
				iconText="Delete design"
				disabled={isPending}
			/>
		</fetcher.Form>
	)
}
