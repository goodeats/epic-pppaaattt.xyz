import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Appearance, type Artboard } from '@prisma/client'
import { useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	TooltipProvider,
} from '#app/components/ui/tooltip'
import { type action } from '#app/root'
import { useIsPending } from '#app/utils/misc'
import { INTENT, ToggleArtboardAppearanceVisibilitySchema } from './actions'

export const ToggleAppearanceVisibilityPanelForm = ({
	artboardId,
	appearanceId,
	isVisible,
	tooltipContent,
}: {
	artboardId: Artboard['id']
	appearanceId: Appearance['id']
	isVisible: boolean
	tooltipContent: string
}) => {
	const fetcher = useFetcher<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: 'panel-toggle-artboard-appearance-visibility',
		constraint: getFieldsetConstraint(ToggleArtboardAppearanceVisibilitySchema),
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="appearanceId" value={appearanceId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.toggleArtboardAppearanceVisibility}
			/>
			<div>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="submit"
								variant="ghost"
								className="flex h-8 w-8 cursor-pointer items-center justify-center"
								disabled={isPending}
							>
								{isVisible ? (
									<Icon name="eye-open">
										<span className="sr-only">Hide</span>
									</Icon>
								) : (
									<Icon name="eye-closed">
										<span className="sr-only">Show</span>
									</Icon>
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>{tooltipContent}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</fetcher.Form>
	)
}
