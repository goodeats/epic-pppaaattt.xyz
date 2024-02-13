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
import { type AppearanceType } from '#app/utils/appearances'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from './actions'
import { type action } from './route'
import { EditArtboardAppearanceOrderSchema } from './zod-schema'

export const EditAppearanceOrderPanelForm = ({
	artboardId,
	appearanceId,
	appearanceType,
	panelCount,
	panelIndex,
	direction,
	tooltipContent,
}: {
	artboardId: Artboard['id']
	appearanceId: Appearance['id']
	appearanceType: AppearanceType
	panelCount: number
	panelIndex: number
	direction: 'up' | 'down'
	tooltipContent: string
}) => {
	const fetcher = useFetcher<typeof action>()
	const isPending = useIsPending()

	const atTop = panelIndex === 0 && direction === 'up'
	const atBottom = panelIndex === panelCount - 1 && direction === 'down'

	const [form] = useForm({
		id: `panel-edit-artboard-appearance-${appearanceId}-order-${direction}`,
		constraint: getFieldsetConstraint(EditArtboardAppearanceOrderSchema),
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="appearanceId" value={appearanceId} />
			<input type="hidden" name="appearanceType" value={appearanceType} />
			<input type="hidden" name="direction" value={direction} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.updateArtboardAppearanceOrder}
			/>
			<div>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="submit"
								variant="ghost"
								className="flex h-4 w-4 cursor-pointer items-center justify-center"
								disabled={isPending || atTop || atBottom}
							>
								<Icon name={`chevron-${direction}`}>
									<span className="sr-only">Move {direction}</span>
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
