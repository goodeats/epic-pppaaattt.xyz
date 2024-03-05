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
import { type IRotate } from '#app/models/rotate.server'
import { EditArtboardRotateBasisSchema } from '#app/schema/rotate'
import { useIsPending } from '#app/utils/misc'
import { INTENT } from '../intent'
import { type action } from '../route'

export const PanelFormArtboardDesignEditRotateBasis = ({
	artboardId,
	rotate,
}: {
	artboardId: Artboard['id']
	rotate: IRotate
}) => {
	const fetcher = useFetcher<typeof action>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `panel-form-artboard-design-edit-rotate-${rotate.id}-basis`,
		constraint: getFieldsetConstraint(EditArtboardRotateBasisSchema),
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
			<input type="hidden" name="artboardId" value={artboardId} />
			<input type="hidden" name="designId" value={rotate.designId} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.artboardUpdateDesignRotateBasis}
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
