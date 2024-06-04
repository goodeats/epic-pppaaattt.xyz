import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type FetcherWithComponents } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { type z } from 'zod'
import { type IconName } from '#app/components/ui/icon'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { useIsPending } from '#app/utils/misc'
import { TooltipHydrated } from '../tooltip'

export const FetcherIconButton = ({
	fetcher,
	route,
	schema,
	formId,
	icon,
	iconText,
	tooltipText,
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
	isHydrated: boolean
	children: JSX.Element
}) => {
	// skip optimistic value for toggle now since
	// icons are different per parent component
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	const [form] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
	})

	return (
		<fetcher.Form
			method="POST"
			action={route}
			{...form.props}
			// className="flex-1"
		>
			<AuthenticityTokenInput />
			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			{/* hidden field values */}
			{children}

			<TooltipHydrated tooltipText={tooltipText} isHydrated={isHydrated}>
				<PanelIconButton
					type="submit"
					iconName={icon}
					iconText={iconText}
					disabled={isPending}
				/>
			</TooltipHydrated>
		</fetcher.Form>
	)
}
