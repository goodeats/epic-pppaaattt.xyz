import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { DeleteArtboardDesignSchema } from '#app/schema/design'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardDesignDelete = ({
	id,
	artboardId,
	isSelectedDesign,
	updateSelectedDesignId,
}: {
	id: string
	artboardId: Artboard['id']
	isSelectedDesign: boolean
	updateSelectedDesignId: string | null | undefined
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: `panel-form-artboard-design-delete-${id}`,
		constraint: getFieldsetConstraint(DeleteArtboardDesignSchema),
		lastSubmission: actionData?.submission,
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={id} />
			<input type="hidden" name="artboardId" value={artboardId} />
			{isSelectedDesign && (
				<input
					type="hidden"
					name="isSelectedDesign"
					value={String(isSelectedDesign)}
				/>
			)}
			{updateSelectedDesignId && (
				<input
					type="hidden"
					name="updateSelectedDesignId"
					value={updateSelectedDesignId}
				/>
			)}
			<input type="hidden" name="intent" value={INTENT.artboardDeleteDesign} />
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
		</fetcher.Form>
	)
}
