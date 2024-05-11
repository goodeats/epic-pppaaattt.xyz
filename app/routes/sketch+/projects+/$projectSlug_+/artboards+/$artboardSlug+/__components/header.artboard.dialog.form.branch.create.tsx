import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { useFetcher, useNavigate } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { type z } from 'zod'
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
import { type IconName } from '#app/components/ui/icon'
import { StatusButton } from '#app/components/ui/status-button'
import { type IArtboard } from '#app/models/artboard/artboard.server'
import { type IArtboardBranch } from '#app/models/artboard-branch/artboard-branch.server'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { actions } from '#app/routes/resources+/api.v1+/routes.server'
import { stringToSlug, useIsPending } from '#app/utils/misc'
import { type RoutePath } from '#app/utils/routes.const'

// planning to revisit design system so not as much effort to make dialog dynamic like fetcher forms

export const DialogFormBranchCreate = ({
	branchId,
	artboardId,
	versionId,
	route,
	formId,
	schema,
	icon,
	iconText,
	title,
	description,
	warningDescription,
}: {
	branchId: IArtboardBranch['id']
	artboardId: IArtboard['id']
	versionId: IArtboardVersion['id']
	route: RoutePath
	formId: string
	schema: z.ZodSchema<any>
	icon: IconName
	iconText: string
	title: string
	description: string
	warningDescription?: string
}) => {
	const [open, setOpen] = useState(false)

	const action = actions[route]
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
				icon={icon}
				text={iconText}
				tooltipText="Create a new branch from current branch and version..."
			/>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
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
					{warningDescription && (
						<p className="body-md pt-4 text-destructive">
							{warningDescription}
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
