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
	EditDesignStrokeBasisSchema,
	StrokeBasisTypeEnum,
} from '#app/schema/stroke'
import { useIsPending } from '#app/utils/misc'
import { DESIGN_STROKE_INTENT } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignStrokeEditBasis = ({
	stroke,
}: {
	stroke: IStroke
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-design-stroke-edit-${stroke.id}-basis`,
		constraint: getFieldsetConstraint(EditDesignStrokeBasisSchema),
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
				value={DESIGN_STROKE_INTENT.updateDesignStrokeBasis}
			/>
			<Select
				onValueChange={value => handleChange(value)}
				disabled={isPending}
				{...conform.input(fields.basis)}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select a format" />
				</SelectTrigger>
				<SelectContent>
					{Object.values(StrokeBasisTypeEnum).map(strokeBasisEnum => (
						<SelectItem key={strokeBasisEnum} value={strokeBasisEnum}>
							{strokeBasisEnum
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
