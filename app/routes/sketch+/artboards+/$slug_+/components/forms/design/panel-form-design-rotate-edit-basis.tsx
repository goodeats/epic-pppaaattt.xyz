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
import { type IRotate } from '#app/models/design-type/rotate/rotate.server'
import {
	EditDesignRotateBasisSchema,
	RotateBasisTypeEnum,
} from '#app/schema/rotate'
import { useIsPending } from '#app/utils/misc'
import { DESIGN_ROTATE_INTENT } from '../../../intent'
import { type action } from '../../../route'

export const PanelFormDesignRotateEditBasis = ({
	rotate,
}: {
	rotate: IRotate
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-design-rotate-edit-${rotate.id}-basis`,
		constraint: getFieldsetConstraint(EditDesignRotateBasisSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...rotate,
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

			<input type="hidden" name="id" value={rotate.id} />
			<input type="hidden" name="designId" value={rotate.designId} />
			<input
				type="hidden"
				name="intent"
				value={DESIGN_ROTATE_INTENT.updateDesignRotateBasis}
			/>
			<Select
				onValueChange={value => handleChange(value)}
				disabled={isPending}
				{...conform.input(fields.basis)}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select a basis" />
				</SelectTrigger>
				<SelectContent>
					{Object.values(RotateBasisTypeEnum).map(rotateBasisEnum => (
						<SelectItem key={rotateBasisEnum} value={rotateBasisEnum}>
							{rotateBasisEnum
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
