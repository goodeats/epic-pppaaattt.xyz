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
import { type IFill } from '#app/models/design-type/fill/fill.server'
import { EditDesignFillStyleSchema, FillStyleTypeEnum } from '#app/schema/fill'
import { useIsPending } from '#app/utils/misc'
import { DESIGN_FILL_INTENT } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignFillEditStyle = ({ fill }: { fill: IFill }) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-design-fill-edit-${fill.id}-style`,
		constraint: getFieldsetConstraint(EditDesignFillStyleSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...fill,
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

			<input type="hidden" name="id" value={fill.id} />
			<input type="hidden" name="designId" value={fill.designId} />
			<input
				type="hidden"
				name="intent"
				value={DESIGN_FILL_INTENT.updateDesignFillStyle}
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
					{Object.values(FillStyleTypeEnum).map(fillBasisEnum => (
						<SelectItem key={fillBasisEnum} value={fillBasisEnum}>
							{fillBasisEnum
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
