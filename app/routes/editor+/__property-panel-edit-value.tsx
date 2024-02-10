import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type Appearance } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { Input } from '#app/components/ui/input'
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	TooltipProvider,
} from '#app/components/ui/tooltip'
import { type action } from '#app/root'
import {
	type AppearanceValuesMap,
	type AppearanceType,
} from '#app/utils/appearances'
import { useIsPending } from '#app/utils/misc'
import { INTENT, UpdateArtboardAppearanceValueSchema } from './actions'

export const EditAppearanceValuePanelForm = ({
	appearance,
	appearanceType,
	tooltipContent,
}: {
	appearance: Pick<Appearance, 'id' | 'value'>
	appearanceType: AppearanceType
	tooltipContent: string
}) => {
	const fetcher = useFetcher<typeof action>()

	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const value = JSON.parse(
		appearance.value,
	) as AppearanceValuesMap[typeof appearanceType]

	const [form, fields] = useForm({
		id: `panel-update-artboard-appearance-${appearance.id}-value`,
		constraint: getFieldsetConstraint(UpdateArtboardAppearanceValueSchema),
		lastSubmission: actionData?.submission,
		onValidate({ formData }) {
			const submission = parse(formData, {
				schema: UpdateArtboardAppearanceValueSchema,
			})
			return submission
		},
		defaultValue: {
			value: value.value,
		},
	})

	const handleSubmit = (event: FocusEvent<HTMLInputElement>) => {
		fetcher.submit(event.currentTarget.form, {
			method: 'POST',
		})
	}

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="appearanceId" value={appearance.id} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.updateArtboardAppearanceValue}
			/>
			<div>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Input
								type="text"
								className={'flex h-8'}
								{...conform.input(fields.value, {
									ariaAttributes: true,
								})}
								onBlur={e => {
									console.log('blur')
									handleSubmit(e)
								}}
								disabled={isPending}
							/>
						</TooltipTrigger>
						<TooltipContent>{tooltipContent}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</fetcher.Form>
	)
}
