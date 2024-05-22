import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { Icon } from '#app/components/ui/icon'
import { StatusButton } from '#app/components/ui/status-button'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { validateArtboardVersionDeleteLayerSubmission } from '#app/models/layer/layer.delete.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { DeleteArtboardVersionLayerSchema } from '#app/schema/layer-artboard-version'
import { artboardVersionLayerDeleteService } from '#app/services/artboard/version/layer/delete.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTBOARD_VERSION.LAYER.DELETE
const schema = DeleteArtboardVersionLayerSchema

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let deleteSuccess = false
	const { status, submission } =
		await validateArtboardVersionDeleteLayerSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await artboardVersionLayerDeleteService({
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

export const ArtboardVersionLayerDelete = ({
	layer,
	artboardVersion,
	formLocation,
}: {
	layer: ILayer
	artboardVersion: IArtboardVersion
	formLocation?: string
}) => {
	const layerId = layer.id
	const versionId = artboardVersion.id
	const formId = `artboard-version-layer-delete-${versionId}-${layerId}${
		formLocation ? `-${formLocation}` : ''
	}`

	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
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
				name={EntityParentIdType.ARTBOARD_VERSION_ID}
				value={versionId}
			/>

			<StatusButton
				type="submit"
				variant="destructive"
				status={isPending ? 'pending' : fetcher.data?.status ?? 'idle'}
				disabled={isPending}
			>
				<Icon name="trash" className="scale-125 max-md:scale-150">
					<span className="max-md:hidden">Delete layer</span>
				</Icon>
			</StatusButton>
		</fetcher.Form>
	)
}
