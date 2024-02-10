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
import { INTENT, DeleteArtboardAppearanceSchema } from './actions'

export const DeleteAppearancePanelForm = ({
	artboardId,
	appearanceId,
	tooltipContent,
}: {
	artboardId: Artboard['id']
	appearanceId: Appearance['id']
	tooltipContent: string
}) => {
	const fetcher = useFetcher<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: `panel-delete-artboard-appearance-${appearanceId}`,
		constraint: getFieldsetConstraint(DeleteArtboardAppearanceSchema),
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="appearanceId" value={appearanceId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.deleteArtboardAppearance}
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
								<Icon name="minus">
									<span className="sr-only">Remove</span>
								</Icon>
							</Button>
						</TooltipTrigger>
						<TooltipContent>{tooltipContent}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</fetcher.Form>
	)
}
