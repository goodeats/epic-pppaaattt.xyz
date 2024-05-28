import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useFetcher, useNavigate } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { Field, TextareaField } from '#app/components/forms'
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
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { validateNewArtworkBranchSubmission } from '#app/models/artwork-branch/artwork-branch.create.server'
import { type IArtworkBranch } from '#app/models/artwork-branch/artwork-branch.server'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { NewArtworkBranchSchema } from '#app/schema/artwork-branch'
import { validateNoJS } from '#app/schema/form-data'
import { artworkBranchCreateService } from '#app/services/artwork/branch/create.service'
import { requireUserId } from '#app/utils/auth.server'
import { stringToSlug, useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK_BRANCH.CREATE
const schema = NewArtworkBranchSchema

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
	const { status, submission } = await validateNewArtworkBranchSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success, message } = await artworkBranchCreateService({
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

export const ArtworkBranchCreate = ({
	artworkId,
	branchId,
	versionId,
}: {
	artworkId: IArtwork['id']
	branchId: IArtworkBranch['id']
	versionId: IArtworkVersion['id']
}) => {
	const [open, setOpen] = useState(false)

	const fetcher = useFetcher<typeof action>()
	const isPending = useIsPending()
	const navigate = useNavigate()
	let isHydrated = useHydrated()

	const [form, fields] = useForm({
		id: `artwork-branch-create-${artworkId}-${branchId}-${versionId}`,
		constraint: getFieldsetConstraint(schema),
		lastSubmission: fetcher.data?.submission,
		onValidate: ({ formData }) => {
			return parse(formData, { schema })
		},
		defaultValue: {
			name: '',
			description: '',
		},
	})

	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data?.status === 'success') {
			const newBranchName = fetcher.data.submission.value.name
			const newBranchSlug = stringToSlug(newBranchName)
			navigate(`../../${newBranchSlug}`)
			setOpen(false)
		}
	}, [fetcher, navigate])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{isHydrated ? (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<DialogTrigger asChild>
								<PanelIconButton iconName="file-plus" iconText="New Branch" />
							</DialogTrigger>
						</TooltipTrigger>
						<TooltipContent>New branch...</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			) : (
				<DialogTrigger asChild>
					<PanelIconButton iconName="file-plus" iconText="New Branch" />
				</DialogTrigger>
			)}
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create a new branch</DialogTitle>
					<DialogDescription>
						Start a new branch for this artwork off the current settings. Add a
						name and description to help understand the changes.
					</DialogDescription>
				</DialogHeader>
				<DialogContentGrid>
					<fetcher.Form method="POST" action={route} {...form.props}>
						<AuthenticityTokenInput />

						<input type="hidden" name="no-js" value={String(!isHydrated)} />
						<input type="hidden" name="id" value={branchId} />
						<input type="hidden" name="artworkId" value={artworkId} />
						<input type="hidden" name="versionId" value={versionId} />

						<DialogFormsContainer>
							<Field
								labelProps={{ children: 'Name' }}
								inputProps={{
									autoFocus: true,
									...conform.input(fields.name, { ariaAttributes: true }),
								}}
								errors={fields.name.errors}
							/>
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
