import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { ToggleVisibleLayerDesignSchema } from '#app/schema/design-layer'
import { useIsPending } from '#app/utils/misc'
import { LAYER_DESIGN_INTENT } from '../../../../intent'
import { type action } from '../../../../route'

export const PanelFormLayerDesignToggleVisibile = ({
	id,
	layerId,
	visible,
	updateSelectedDesignId,
}: {
	id: string
	layerId: Artboard['id']
	visible: boolean
	updateSelectedDesignId: string | null | undefined
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: `panel-form-layer-design-toggle-visible-${id}`,
		constraint: getFieldsetConstraint(ToggleVisibleLayerDesignSchema),
		lastSubmission: actionData?.submission,
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={id} />
			<input type="hidden" name="layerId" value={layerId} />
			{updateSelectedDesignId && (
				<input
					type="hidden"
					name="updateSelectedDesignId"
					value={updateSelectedDesignId}
				/>
			)}
			<input
				type="hidden"
				name="intent"
				value={LAYER_DESIGN_INTENT.layerToggleVisibleDesign}
			/>
			<Button
				type="submit"
				variant="ghost"
				className="flex h-8 w-8 cursor-pointer items-center justify-center"
				disabled={isPending}
			>
				{visible ? (
					<Icon name="eye-open">
						<span className="sr-only">Hide</span>
					</Icon>
				) : (
					<Icon name="eye-closed">
						<span className="sr-only">Show</span>
					</Icon>
				)}
			</Button>
		</fetcher.Form>
	)
}
