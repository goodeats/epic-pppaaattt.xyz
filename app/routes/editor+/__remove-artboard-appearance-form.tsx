import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { DropdownMenuItem } from '#app/components/ui/dropdown-menu'
import { useIsPending } from '#app/utils/misc'
import { INTENT, RemoveArtboardAppearanceEditorSchema } from './actions'
import { type action } from './route'

export function RemoveArtboardAppearanceForm({
	artboardId,
	appearanceId,
}: {
	artboardId: string
	appearanceId: string
}) {
	const fetcher = useFetcher()

	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: `remove-artboard-appearance-${appearanceId}`,
		lastSubmission: actionData?.submission,
		constraint: getFieldsetConstraint(RemoveArtboardAppearanceEditorSchema),
	})

	return (
		<DropdownMenuItem asChild>
			<fetcher.Form method="POST" {...form.props}>
				<AuthenticityTokenInput />

				<input type="hidden" name="artboardId" value={artboardId} />
				<input type="hidden" name="appearanceId" value={appearanceId} />
				<input
					type="hidden"
					name="intent"
					value={INTENT.removeArtboardAppearance}
				/>
				<button type="submit" disabled={isPending}>
					Remove
				</button>
			</fetcher.Form>
		</DropdownMenuItem>
	)
}
