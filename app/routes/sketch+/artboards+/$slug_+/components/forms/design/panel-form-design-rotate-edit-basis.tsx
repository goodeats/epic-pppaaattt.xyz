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
import { type IRotate } from '#app/models/rotate.server'
import { EditDesignRotateBasisSchema } from '#app/schema/rotate'
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
					<SelectItem value="defined">Defined</SelectItem>
					<SelectItem value="random">Random</SelectItem>
					<SelectItem value="N">N</SelectItem>
					<SelectItem value="NE">NE</SelectItem>
					<SelectItem value="E">E</SelectItem>
					<SelectItem value="SE">SE</SelectItem>
					<SelectItem value="S">S</SelectItem>
					<SelectItem value="SW">SW</SelectItem>
					<SelectItem value="W">W</SelectItem>
					<SelectItem value="NW">NW</SelectItem>
				</SelectContent>
			</Select>
		</fetcher.Form>
	)
}
