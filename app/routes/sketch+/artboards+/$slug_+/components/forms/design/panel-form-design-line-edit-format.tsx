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
import { type ILine } from '#app/models/design-type/line/line.server'
import {
	EditDesignLineFormatSchema,
	LineFormatTypeEnum,
} from '#app/schema/line'
import { useIsPending } from '#app/utils/misc'
import { DESIGN_LINE_INTENT } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignLineEditFormat = ({ line }: { line: ILine }) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-design-line-edit-${line.id}-format`,
		constraint: getFieldsetConstraint(EditDesignLineFormatSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...line,
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

			<input type="hidden" name="id" value={line.id} />
			<input type="hidden" name="designId" value={line.designId} />
			<input
				type="hidden"
				name="intent"
				value={DESIGN_LINE_INTENT.updateDesignLineFormat}
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
					{Object.values(LineFormatTypeEnum).map(lineFormatEnum => (
						<SelectItem key={lineFormatEnum} value={lineFormatEnum}>
							{lineFormatEnum
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
