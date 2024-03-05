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
import { type ITemplate } from '#app/models/template.server'
import { EditArtboardTemplateStyleSchema } from '#app/schema/template'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardDesignEditTemplateStyle = ({
	artboardId,
	template,
}: {
	artboardId: Artboard['id']
	template: ITemplate
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-artboard-design-edit-template-${template.id}-style`,
		constraint: getFieldsetConstraint(EditArtboardTemplateStyleSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...template,
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

			<input type="hidden" name="id" value={template.id} />
			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="designId" value={template.designId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.artboardUpdateDesignTemplateStyle}
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
					<SelectItem value="triangle">Triangle</SelectItem>
				</SelectContent>
			</Select>
		</fetcher.Form>
	)
}
