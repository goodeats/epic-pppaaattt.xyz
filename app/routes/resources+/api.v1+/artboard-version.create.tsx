import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import {
	type LoaderFunctionArgs,
	json,
	type DataFunctionArgs,
} from '@remix-run/node'
import { useFetcher, useNavigate, useParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { TextareaField } from '#app/components/forms'
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
import { validateNewArtboardVersionSubmission } from '#app/models/artboard-version/artboard-version.create.server'
import { NewArtboardVersionSchema } from '#app/schema/artboard-version'
import {
	type IEntityId,
	type IEntityParentId,
	type entityParentIdTypeEnum,
} from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { artboardVersionCreateService } from '#app/services/artboard/branch/version/create.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'

// https://www.epicweb.dev/full-stack-components

const schema = NewArtboardVersionSchema

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let createSuccess = false
	const { status, submission } = await validateNewArtboardVersionSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		const { success } = await artboardVersionCreateService({
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

export const ArtboardVersionCreate = ({
	entityId,
	parentTypeId,
	parentId,
	// route,
	formId, // schema,
	onOlderVersion, // iconText,
	// title,
} // icon,
// description,
// warningDescription,
: {
	entityId?: IEntityId
	parentTypeId?: entityParentIdTypeEnum
	parentId?: IEntityParentId
	// route: RoutePath
	formId: string
	onOlderVersion: boolean
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
	const params = useParams()
	const navigate = useNavigate()

	let isHydrated = useHydrated()
	const [form, fields] = useForm({
		id: `${formId}-${parentId || 'parent'}-${entityId || 'new'}`,
		constraint: getFieldsetConstraint(schema),
		lastSubmission: fetcher.data?.submission,
		defaultValue: {
			description: '',
		},
	})

	// actions on successful submission
	// https://www.nico.fyi/blog/close-dialog-with-use-fetcher-remix
	// I've enjoyed creating an api out of the resource routes,
	// but maybe I should redirect from the action instead of
	// waiting for the json response to redirect from the client
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
			<TooltipIconDialogTrigger
				icon="card-stack-plus"
				text="New Version"
				tooltipText="Save current changes to new version..."
			/>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create new version</DialogTitle>
					<DialogDescription>
						Save a new version of this artboard. Add a description to help
						understand the changes. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<fetcher.Form method="POST" {...form.props}>
						{/* <fetcher.Form method="POST" action={route} {...form.props}> */}
						<AuthenticityTokenInput />

						<input type="hidden" name="no-js" value={String(!isHydrated)} />
						<input type="hidden" name="id" value={entityId} />
						{parentId && (
							<input type="hidden" name={parentTypeId} value={parentId} />
						)}

						<div className="grid grid-cols-4 items-center gap-4">
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
					{onOlderVersion && (
						<p className="body-md pt-4 text-destructive">
							Creating a new version will erase all versions after the current
							version.
						</p>
					)}
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
