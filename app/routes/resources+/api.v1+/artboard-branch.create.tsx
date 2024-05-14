import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import {
	type LoaderFunctionArgs,
	json,
	type DataFunctionArgs,
} from '@remix-run/node'
import { useFetcher, useNavigate } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { Field, TextareaField } from '#app/components/forms'
import { TooltipIconDialogTrigger } from '#app/components/templates/navbar'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '#app/components/ui/dialog'
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

// https://www.epicweb.dev/full-stack-components

const schema = NewArtboardBranchSchema

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	// this is starting to get messy
	// but want to ensure no redirect if params are valid
	// and service encounters an error
	// ... had to revert back to the original code so fetcher button form doesn't break
	// refactor this later
	let createSuccess = false
	let errorMessage = ''
	// let responseStatus = ''
	const { status, submission } = await validateNewArtboardBranchSubmission({
		userId,
		formData,
	})
	// responseStatus = status

	if (status === 'success') {
		const { success, message } = await artboardBranchCreateService({
			userId,
			...submission.value,
		})
		createSuccess = success
		// responseStatus = success ? 'success' : 'error'
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
	// route,
	formId, // schema,
	// iconText,
} // icon,
// title,
// description,
// warningDescription,
: {
	branchId: IArtboardBranch['id']
	artboardId: IArtboard['id']
	versionId: IArtboardVersion['id']
	// route: RoutePath
	formId: string
	// schema: z.ZodSchema<any>
	// icon: IconName
	// iconText: string
	// title: string
	// description: string
	// warningDescription?: string
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

	// actions on successful submission
	// I've enjoyed creating an api out of the resource routes,
	// but maybe I should redirect from the action instead of
	// waiting for the json response to redirect from the client
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
			<TooltipIconDialogTrigger
				icon="file-plus"
				text="New Branch"
				tooltipText="Create a new branch from current branch and version..."
			/>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create a new branch</DialogTitle>
					<DialogDescription>
						Save a new branch of this artboard. Add a name and description to
						help understand the changes. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					{/* <fetcher.Form method="POST" action={route} {...form.props}> */}
					<fetcher.Form method="POST" {...form.props}>
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
