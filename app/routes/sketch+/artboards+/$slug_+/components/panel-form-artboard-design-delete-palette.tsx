import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { type IPalette } from '#app/models/design.server'
import { DeleteArtboardPaletteSchema } from '#app/schema/palette'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardDesignDeletePalette = ({
	artboardId,
	palette,
}: {
	artboardId: Artboard['id']
	palette: IPalette
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: `panel-form-artboard-design-edit-palette-${palette.id}`,
		constraint: getFieldsetConstraint(DeleteArtboardPaletteSchema),
		lastSubmission: actionData?.submission,
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={palette.id} />
			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="designId" value={palette.designId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.artboardDeleteDesignPalette}
			/>
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
