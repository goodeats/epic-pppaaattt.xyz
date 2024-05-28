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
import { validateArtworkVersionStarredSubmission } from '#app/models/artwork-version/artwork-version.update.server'
import { ArtworkVersionStarredSchema } from '#app/schema/artwork-version'
import { validateNoJS } from '#app/schema/form-data'
import { updateArtworkVersionStarredService } from '#app/services/artwork/version/update.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

// TODO: prevent starring if artwork doesn't have all design types set

const route = Routes.RESOURCES.API.V1.ARTWORK_VERSION.UPDATE.STARRED
const schema = ArtworkVersionStarredSchema

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let createSuccess = false
	const { status, submission } = await validateArtworkVersionStarredSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success } = await updateArtworkVersionStarredService({
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

export const ArtworkVersionToggleStarred = ({
	version,
}: {
	version: IArtworkVersion
}) => {
	const versionId = version.id
	const isStarred = version.starred
	const icon = isStarred ? 'star-filled' : 'star'
	const iconText = isStarred ? 'Unstar version' : 'Star version'
	const tooltipText = isStarred
		? 'Remove from starred versions'
		: 'Add to starred versions'

	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form] = useForm({
		id: `artwork-version-toggle-starred-${versionId}`,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
	})
	return (
		<fetcher.Form method="POST" action={route} {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			<input type="hidden" name="id" value={versionId} />

			{isHydrated ? (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<PanelIconButton
								type="submit"
								iconName={icon}
								iconText={iconText}
								disabled={isPending}
							/>
						</TooltipTrigger>
						<TooltipContent>{tooltipText}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			) : (
				<PanelIconButton
					type="submit"
					iconName={icon}
					iconText={iconText}
					disabled={isPending}
				/>
			)}
		</fetcher.Form>
	)
}
