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
import { type IStroke } from '#app/models/stroke.server'
import {
	EditDesignStrokeStyleSchema,
	StrokeStyleTypeEnum,
} from '#app/schema/stroke'
import { useIsPending } from '#app/utils/misc'
import { DESIGN_STROKE_INTENT } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignStrokeEditStyle = ({
	stroke,
}: {
	stroke: IStroke
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-design-stroke-edit-${stroke.id}-style`,
		constraint: getFieldsetConstraint(EditDesignStrokeStyleSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...stroke,
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

			<input type="hidden" name="id" value={stroke.id} />
			<input type="hidden" name="designId" value={stroke.designId} />
			<input
				type="hidden"
				name="intent"
				value={DESIGN_STROKE_INTENT.updateDesignStrokeStyle}
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
					{Object.values(StrokeStyleTypeEnum).map(strokeStyleEnum => (
						<SelectItem key={strokeStyleEnum} value={strokeStyleEnum}>
							{strokeStyleEnum
								.split('-')
								.map(word => word.charAt(0).toUpperCase() + word.slice(1))
								.join(' - ')}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</fetcher.Form>
	)
}
