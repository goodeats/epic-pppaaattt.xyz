import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { type designTypeEnum } from '#app/schema/design'
import { NewArtboardDesignSchema } from '#app/schema/design-artboard'
import { useIsPending } from '#app/utils/misc'
import { ARTBOARD_DESIGN_INTENT } from '../../../../intent'
import { type action } from '../../../../route'

type PanelFormArtboardDesignNewProps = {
	artboardId: Artboard['id']
	type: designTypeEnum
	visibleDesignsCount: number
}

export const PanelFormArtboardDesignNew = ({
	artboardId,
	type,
	visibleDesignsCount,
}: PanelFormArtboardDesignNewProps) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: `panel-form-artboard-design-new-${type}`,
		constraint: getFieldsetConstraint(NewArtboardDesignSchema),
		lastSubmission: actionData?.submission,
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="type" value={type} />
			<input
				type="hidden"
				name="visibleDesignsCount"
				value={visibleDesignsCount}
			/>
			<input
				type="hidden"
				name="intent"
				value={ARTBOARD_DESIGN_INTENT.artboardCreateDesign}
			/>

			<Button
				type="submit"
				variant="ghost"
				className="flex h-8 w-8 cursor-pointer items-center justify-center"
				disabled={isPending}
			>
				<Icon name="plus">
					<span className="sr-only">Add New</span>
				</Icon>
			</Button>
		</fetcher.Form>
	)
}
