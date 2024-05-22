import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { useFetcher, useNavigate, useParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { TextareaField } from '#app/components/forms'
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
import { validateNewArtworkVersionSubmission } from '#app/models/artwork-version/artwork-version.create.server'
import { NewArtworkVersionSchema } from '#app/schema/artwork-version'
import {
	type IEntityId,
	type IEntityParentId,
	type entityParentIdTypeEnum,
} from '#app/schema/entity'
import { validateNoJS } from '#app/schema/form-data'
import { artworkVersionCreateService } from '#app/services/artwork/branch/version/create.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK_VERSION.CREATE
const schema = NewArtworkVersionSchema

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
	entityId,
	parentTypeId,
	parentId,
	formId,
	onOlderVersion,
}: {
	entityId?: IEntityId
	parentTypeId?: entityParentIdTypeEnum
	parentId?: IEntityParentId
	formId: string
	onOlderVersion: boolean
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
			{/* Warning: Expected server HTML to contain a matching <button> in <button>. */}
			{/* <TooltipIconDialogTrigger
				icon="card-stack-plus"
				text="New Version"
				tooltipText="Save current changes to new version..."
			/> */}

			{/* Tooltip on dialog is not a priority right now */}
			<DialogTrigger asChild>
				<PanelIconButton iconName="card-stack-plus" iconText="New Version" />
			</DialogTrigger>

			{/* <TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<DialogTrigger asChild>
							<PanelIconButton
								iconName="card-stack-plus"
								iconText="New Version"
							/>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent>
						Save current changes to new version...
					</TooltipContent>
				</Tooltip>
			</TooltipProvider> */}
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create new version</DialogTitle>
					<DialogDescription>
						Save a new version of this artwork. Add a description to help
						understand the changes. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<fetcher.Form method="POST" action={route} {...form.props}>
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
