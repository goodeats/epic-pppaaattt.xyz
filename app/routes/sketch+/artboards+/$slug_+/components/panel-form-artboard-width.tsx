import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Icon } from '#app/components/ui/icon'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { ArtboardWidthSchema } from '#app/schema/artboard'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type PickedArtboardType } from '../queries'
import { type action } from '../route'

export const PanelFormArtboardWidth = ({
	artboard,
}: {
	artboard: Pick<PickedArtboardType, 'id' | 'width'>
}) => {
	const fetcher = useFetcher<typeof action>()

	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	const [form, fields] = useForm({
		id: 'panel-form-artboard-width',
		constraint: getFieldsetConstraint(ArtboardWidthSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...artboard,
		},
	})

	const handleSubmit = (event: FocusEvent<HTMLInputElement>) => {
		fetcher.submit(event.currentTarget.form, {
			method: 'POST',
		})
	}

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={artboard.id} />
			<input type="hidden" name="intent" value={INTENT.artboardUpdateWidth} />
			<div className="flex w-full items-center space-x-2">
				<Label htmlFor={fields.width.id} className="w-5 flex-shrink-0">
					<Icon name="width" className="h-5 w-5" />
				</Label>
				<Input
					type="number"
					className="flex h-8"
					onBlur={e => handleSubmit(e)}
					disabled={isPending}
					{...conform.input(fields.width, {
						ariaAttributes: true,
					})}
				/>
			</div>
		</fetcher.Form>
	)
}
