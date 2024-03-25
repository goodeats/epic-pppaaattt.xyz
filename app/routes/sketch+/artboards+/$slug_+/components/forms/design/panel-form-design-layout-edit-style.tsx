import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
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
import { EditDesignLayoutStyleSchema } from '#app/schema/layout'
import { useIsPending } from '#app/utils/misc'
import { DESIGN_LAYOUT_INTENT } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignLayoutEditStyle = ({
	layout,
}: {
	layout: ILayout
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-design-layout-edit-${layout.id}-style`,
		constraint: getFieldsetConstraint(EditDesignLayoutStyleSchema),
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
			<input type="hidden" name="designId" value={layout.designId} />
			<input
				type="hidden"
				name="intent"
				value={DESIGN_LAYOUT_INTENT.updateDesignLayoutStyle}
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
