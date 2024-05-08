import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useFetcher } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { type z } from 'zod'
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
import { type IconName } from '#app/components/ui/icon'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { StatusButton } from '#app/components/ui/status-button'
import {
	type IEntityId,
	type IEntityParentId,
	type entityParentIdTypeEnum,
} from '#app/schema/entity'
import { useIsPending } from '#app/utils/misc'
import { getActionType, type RoutePath } from '#app/utils/routes.utils'

// 3 things:
// friendly reminder to change the form id when switching a fetcher.form icon to dialog
// explore not needing actionData on other forms and fetcher is action, not loader
// planning to revisit design system so not as much effort to make dialog dynamic like fetcher forms

export const DialogFormVersionCreate = ({
	entityId,
	parentTypeId,
	parentId,
	route,
	formId,
	schema,
	icon,
	iconText,
	title,
	description,
	warningDescription,
}: {
	entityId?: IEntityId
	parentTypeId?: entityParentIdTypeEnum
	parentId?: IEntityParentId
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

	const action = getActionType(route)
	const fetcher = useFetcher<typeof action>()
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form, fields] = useForm({
		id: `${formId}-${parentId || 'parent'}-${entityId || 'new'}`,
		constraint: getFieldsetConstraint(schema),
		lastSubmission: fetcher.data?.submission,
		defaultValue: {
			description: '',
		},
	})

	// close dialog on successful submission
	// https://www.nico.fyi/blog/close-dialog-with-use-fetcher-remix
	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data?.status === 'success') {
			setOpen(false)
		}
	}, [fetcher])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<PanelIconButton iconName={icon} iconText={iconText} />
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
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
