import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Input } from '#app/components/ui/input'
import { type ILine } from '#app/models/line.server'
import { EditArtboardLineWidthSchema } from '#app/schema/line'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardDesignEditLine = ({
	artboardId,
	line,
}: {
	artboardId: Artboard['id']
	line: ILine
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-artboard-design-edit-line-${line.id}`,
		constraint: getFieldsetConstraint(EditArtboardLineWidthSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...line,
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

			<input type="hidden" name="id" value={line.id} />
			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="designId" value={line.designId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.artboardUpdateDesignLineWidth}
			/>
			<Input
				type="number"
				min={0}
				className={'flex h-8'}
				onBlur={e => handleSubmit(e)}
				autoComplete="off"
				disabled={isPending}
				{...conform.input(fields.width, {
					ariaAttributes: true,
				})}
			/>
		</fetcher.Form>
	)
}
