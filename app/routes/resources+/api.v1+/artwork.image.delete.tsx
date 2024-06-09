import { useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
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
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { validateArtworkImageDeleteSubmission } from '#app/models/images/artwork-image.delete.server'
import { type IArtworkImage } from '#app/models/images/artwork-image.server'
import { DeleteArtworkImageSchema } from '#app/schema/artwork-image'
import { EntityParentIdType } from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { artworkImageDeleteService } from '#app/services/artwork/image/delete.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK.IMAGE.DELETE
const schema = DeleteArtworkImageSchema

// auth GET request to endpoint
export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let createSuccess = false
	let errorMessage = ''
	const { status, submission } = await validateArtworkImageDeleteSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success, message } = await artworkImageDeleteService({
			userId,
			...submission.value,
		})

		createSuccess = success
		errorMessage = message || ''
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission, message: errorMessage },
		{
			status: status === 'error' || !createSuccess ? 422 : 201,
		},
	)
}

export const ArtworkImageDelete = ({
	image,
	artwork,
}: {
	image: IArtworkImage
	artwork: IArtwork
}) => {
	const imageId = image.id
	const iconText = `Delete image`

	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	let isHydrated = useHydrated()

	const [form] = useForm({
		id: `artwork-image-delete-${imageId}`,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
		onValidate: ({ formData }) => {
			const parsed = parse(formData, { schema })
			console.log('parsed', parsed)
			return parse(formData, { schema })
		},
	})

	return (
		<fetcher.Form method="POST" action={route} {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			<input type="hidden" name="id" value={imageId} />
			<input
				type="hidden"
				name={EntityParentIdType.ARTWORK_ID}
				value={artwork.id}
			/>

			<TooltipHydrated tooltipText={iconText} isHydrated={isHydrated}>
				<PanelIconButton
					type="submit"
					iconName="trash"
					iconText={iconText}
					disabled={isPending}
				/>
			</TooltipHydrated>
		</fetcher.Form>
	)
}
