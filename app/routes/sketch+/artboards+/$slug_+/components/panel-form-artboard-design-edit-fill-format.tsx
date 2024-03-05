import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '#app/components/ui/select'
import { type IFill } from '#app/models/fill.server'
import { EditArtboardFillStyleSchema } from '#app/schema/fill'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardDesignEditFillFormat = ({
	artboardId,
	fill,
}: {
	artboardId: Artboard['id']
	fill: IFill
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-artboard-design-edit-fill-${fill.id}-format`,
		constraint: getFieldsetConstraint(EditArtboardFillStyleSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...fill,
		},
	})

	// const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
	// 	console.log('handleChange', event)
	// 	fetcher.submit(event.currentTarget.form, {
	// 		method: 'POST',
	// 	})
	// }

	const handleChange = (value: string) => {
		// console.log('handleChange', value)
		fetcher.submit(form.ref.current, {
			method: 'POST',
		})
	}

	return (
		<fetcher.Form
			method="POST"
			{...form.props}
			className={'col-span-2 flex h-8'}
		>
			<AuthenticityTokenInput />

			<input type="hidden" name="id" value={fill.id} />
			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="designId" value={fill.designId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.artboardUpdateDesignFillStyle}
			/>
			<Select
				onValueChange={value => handleChange(value)}
				disabled={isPending}
				{...conform.input(fields.style)}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select a format" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="solid">Solid</SelectItem>
					<SelectItem value="none">None</SelectItem>
				</SelectContent>
			</Select>
		</fetcher.Form>
	)
}
