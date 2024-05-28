import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher, useNavigate, useParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { TextareaField } from '#app/components/forms'
import {
	DialogContentGrid,
	DialogFormsContainer,
} from '#app/components/layout/dialog'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '#app/components/ui/dialog'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { StatusButton } from '#app/components/ui/status-button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip'
import { type IArtworkBranch } from '#app/models/artwork-branch/artwork-branch.server'
import { validateNewArtworkVersionSubmission } from '#app/models/artwork-version/artwork-version.create.server'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { NewArtworkVersionSchema } from '#app/schema/artwork-version'
import { validateNoJS } from '#app/schema/form-data'
import { artworkVersionCreateService } from '#app/services/artwork/branch/version/create.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK_VERSION.CREATE
const schema = NewArtworkVersionSchema

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let createSuccess = false
	const { status, submission } = await validateNewArtworkVersionSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success } = await artworkVersionCreateService({
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

export const ArtworkVersionCreate = ({
	branchId,
	versionId,
	onOlderVersion,
}: {
	branchId: IArtworkBranch['id']
	versionId: IArtworkVersion['id']
	onOlderVersion: boolean
}) => {
	const [open, setOpen] = useState(false)

	const fetcher = useFetcher<typeof action>()
	const isPending = useIsPending()
	const params = useParams()
	const navigate = useNavigate()
	let isHydrated = useHydrated()

	const [form, fields] = useForm({
		id: `artwork-version-create-${branchId || 'parent'}-${versionId || 'new'}`,
		constraint: getFieldsetConstraint(schema),
		lastSubmission: fetcher.data?.submission,
		defaultValue: {
			description: '',
		},
	})

	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data?.status === 'success') {
			if (params.versionSlug !== 'latest') {
				// navigate to latest version if not already there
				navigate('../latest')
			} else {
				// close dialog if already on latest version
				setOpen(false)
			}
		}
	}, [fetcher, params, navigate])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{isHydrated ? (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<DialogTrigger asChild>
								<PanelIconButton
									iconName="card-stack-plus"
									iconText="New Version"
								/>
							</DialogTrigger>
						</TooltipTrigger>
						<TooltipContent>Save version...</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			) : (
				<DialogTrigger asChild>
					<PanelIconButton iconName="card-stack-plus" iconText="New Version" />
				</DialogTrigger>
			)}

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Save version</DialogTitle>
					<DialogDescription>
						Save current settings of this artwork to a version. Add a
						description to help understand the changes. A new version will be
						created from here.
					</DialogDescription>
				</DialogHeader>
				<DialogContentGrid>
					<fetcher.Form method="POST" action={route} {...form.props}>
						<AuthenticityTokenInput />

						<input type="hidden" name="no-js" value={String(!isHydrated)} />
						<input type="hidden" name="id" value={versionId} />
						<input type="hidden" name="branchId" value={branchId} />

						<DialogFormsContainer>
							<TextareaField
								labelProps={{ children: 'Description' }}
								textareaProps={{
									...conform.textarea(fields.description, {
										ariaAttributes: true,
									}),
								}}
								errors={fields.description.errors}
							/>
						</DialogFormsContainer>
					</fetcher.Form>
					{onOlderVersion ? (
						<p className="body-md pt-4 text-destructive">
							WARNING: Saving the version before "latest" will erase all
							versions after the current version. Consider creating a new branch
							instead if you want to keep the existing versions.
						</p>
					) : (
						<p className="body-md pt-4">
							To undo version history, just save a version from the last desired
							version before the "latest" and all existing versions after that
							will be replaced.
						</p>
					)}
				</DialogContentGrid>
				<DialogFooter>
					<StatusButton
						form={form.id}
						type="submit"
						disabled={isPending}
						status={isPending ? 'pending' : 'idle'}
					>
						Submit
					</StatusButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
