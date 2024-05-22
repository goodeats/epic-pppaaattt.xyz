import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { useFetcher, useNavigate } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { Field, TextareaField } from '#app/components/forms'
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
import { type IArtboard } from '#app/models/artboard/artboard.server'
import { validateNewArtboardBranchSubmission } from '#app/models/artboard-branch/artboard-branch.create.server'
import { type IArtboardBranch } from '#app/models/artboard-branch/artboard-branch.server'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { NewArtboardBranchSchema } from '#app/schema/artboard-branch'
import { validateNoJS } from '#app/schema/form-data'
import { artboardBranchCreateService } from '#app/services/artboard/branch/create.service'
import { requireUserId } from '#app/utils/auth.server'
import { stringToSlug, useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTBOARD_BRANCH.CREATE
const schema = NewArtboardBranchSchema

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let createSuccess = false
	let errorMessage = ''
	const { status, submission } = await validateNewArtboardBranchSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success, message } = await artboardBranchCreateService({
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

export const ArtboardBranchCreate = ({
	branchId,
	artboardId,
	versionId,
	formId,
}: {
	branchId: IArtboardBranch['id']
	artboardId: IArtboard['id']
	versionId: IArtboardVersion['id']
	formId: string
}) => {
	const [open, setOpen] = useState(false)

	const fetcher = useFetcher<typeof action>()
	const isPending = useIsPending()
	const navigate = useNavigate()

	let isHydrated = useHydrated()
	const [form, fields] = useForm({
		id: `${formId}-${artboardId}-${branchId}-${versionId}`,
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
			{/* Warning: Expected server HTML to contain a matching <button> in <button>. */}
			{/* <TooltipIconDialogTrigger
				icon="file-plus"
				text="New Branch"
				tooltipText="Create a new branch from current branch and version..."
			/> */}
			{/* Tooltip on dialog is not a priority right now */}
			<DialogTrigger asChild>
				<PanelIconButton iconName="file-plus" iconText="New Branch" />
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create a new branch</DialogTitle>
					<DialogDescription>
						Save a new branch of this artboard. Add a name and description to
						help understand the changes. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<fetcher.Form method="POST" action={route} {...form.props}>
						<AuthenticityTokenInput />

						<input type="hidden" name="no-js" value={String(!isHydrated)} />
						<input type="hidden" name="id" value={branchId} />
						<input type="hidden" name="artboardId" value={artboardId} />
						<input type="hidden" name="versionId" value={versionId} />

						<div className="grid grid-cols-4 items-center gap-4">
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
						</div>
					</fetcher.Form>
				</div>
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
