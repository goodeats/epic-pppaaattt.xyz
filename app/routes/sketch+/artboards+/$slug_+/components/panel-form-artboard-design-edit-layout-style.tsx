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
import { type ILayout } from '#app/models/layout.server'
import { EditArtboardLayoutStyleSchema } from '#app/schema/layout'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardDesignEditLayoutStyle = ({
	artboardId,
	layout,
}: {
	artboardId: Artboard['id']
	layout: ILayout
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-artboard-design-edit-layout-${layout.id}-style`,
		constraint: getFieldsetConstraint(EditArtboardLayoutStyleSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...layout,
		},
	})

	const handleChange = (value: string) => {
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

			<input type="hidden" name="id" value={layout.id} />
			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="designId" value={layout.designId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.artboardUpdateDesignLayoutStyle}
			/>
			<Select
				onValueChange={value => handleChange(value)}
				disabled={isPending}
				{...conform.input(fields.style)}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select a style" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="random">Random</SelectItem>
					<SelectItem value="grid">Grid</SelectItem>
				</SelectContent>
			</Select>
		</fetcher.Form>
	)
}
