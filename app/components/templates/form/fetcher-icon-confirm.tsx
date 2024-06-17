import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type FetcherWithComponents } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { type z } from 'zod'
import { Button } from '#app/components/ui/button'
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
import { useIsPending } from '#app/utils/misc'
import { TooltipHydrated } from '../tooltip'

export const FetcherIconConfirm = ({
	fetcher,
	route,
	schema,
	formId,
	icon,
	iconText,
	tooltipText,
	dialogTitle,
	dialogDescription,
	confirmButtonText,
	isHydrated,
	children,
}: {
	fetcher: FetcherWithComponents<any>
	route: string
	schema: z.ZodSchema<any>
	formId: string
	icon: IconName
	iconText: string
	tooltipText: string
	dialogTitle: string
	dialogDescription: string
	confirmButtonText?: string
	isHydrated: boolean
	children: JSX.Element
}) => {
	const [open, setOpen] = useState(false)

	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	const [form] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
	})

	// close after successful submission
	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data?.status === 'success') {
			setOpen(false)
		}
	}, [fetcher])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<TooltipHydrated tooltipText={tooltipText} isHydrated={isHydrated}>
				<DialogTrigger asChild>
					<PanelIconButton iconName={icon} iconText={iconText} />
				</DialogTrigger>
			</TooltipHydrated>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{dialogTitle}</DialogTitle>
					<DialogDescription>{dialogDescription}</DialogDescription>
				</DialogHeader>
				<fetcher.Form method="POST" action={route} {...form.props}>
					<AuthenticityTokenInput />
					<input type="hidden" name="no-js" value={String(!isHydrated)} />
					{children}
				</fetcher.Form>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<StatusButton
						form={form.id}
						type="submit"
						variant="destructive"
						disabled={isPending}
						status={isPending ? 'pending' : 'idle'}
					>
						{confirmButtonText || 'Confirm'}
					</StatusButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
