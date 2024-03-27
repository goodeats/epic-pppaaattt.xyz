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
import { type ISize } from '#app/models/size.server'
import {
	EditDesignSizeFormatSchema,
	SizeFormatTypeEnum,
} from '#app/schema/size'
import { useIsPending } from '#app/utils/misc'
import { DESIGN_SIZE_INTENT } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignSizeEditFormat = ({ size }: { size: ISize }) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-design-size-edit-${size.id}-format`,
		constraint: getFieldsetConstraint(EditDesignSizeFormatSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...size,
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

			<input type="hidden" name="id" value={size.id} />
			<input type="hidden" name="designId" value={size.designId} />
			<input
				type="hidden"
				name="intent"
				value={DESIGN_SIZE_INTENT.updateDesignSizeFormat}
			/>
			<Select
				onValueChange={value => handleChange(value)}
				disabled={isPending}
				{...conform.input(fields.format)}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select a format" />
				</SelectTrigger>
				<SelectContent>
					{Object.values(SizeFormatTypeEnum).map(sizeFormatEnum => (
						<SelectItem key={sizeFormatEnum} value={sizeFormatEnum}>
							{sizeFormatEnum
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
