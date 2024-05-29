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
import { Icon } from '#app/components/ui/icon'
import { StatusButton } from '#app/components/ui/status-button'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { validateArtworkVersionDeleteLayerSubmission } from '#app/models/layer/layer.delete.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { DeleteArtworkVersionLayerSchema } from '#app/schema/layer-artwork-version'
import { artworkVersionLayerDeleteService } from '#app/services/artwork/version/layer/delete.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK_VERSION.LAYER.DELETE
const schema = DeleteArtworkVersionLayerSchema

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
		await validateArtworkVersionDeleteLayerSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await artworkVersionLayerDeleteService({
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
			status: status === 'error' || !deleteSuccess ? 422 : 201,
		},
	)
}

export const ArtworkVersionLayerDelete = ({
	layer,
	artworkVersion,
	formLocation,
}: {
	layer: ILayer
	artworkVersion: IArtworkVersion
	formLocation?: string
}) => {
	const layerId = layer.id
	const versionId = artworkVersion.id
	const formId = `artwork-version-layer-delete-${versionId}-${layerId}${
		formLocation ? `-${formLocation}` : ''
	}`

	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isDeleted = fetcher.data?.status === 'success'
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
		onSubmit: async (event, { formData }) => {
			event.preventDefault()
			fetcher.submit(formData, {
				method: 'POST',
				action: route,
			})
		},
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

			<StatusButton
				type="submit"
				variant="destructive"
				status={isPending ? 'pending' : fetcher.data?.status ?? 'idle'}
				disabled={isPending}
			>
				<Icon name="trash" className="scale-125 max-md:scale-150">
					<span className="max-md:hidden">
						{isDeleted ? 'Deleted' : 'Delete layer'}
					</span>
				</Icon>
			</StatusButton>
		</fetcher.Form>
	)
}
