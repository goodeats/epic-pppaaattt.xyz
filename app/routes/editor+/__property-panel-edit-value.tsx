import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Appearance } from '@prisma/client'
import { useActionData, useFetcher } from '@remix-run/react'
import { type ChangeEvent, type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { quickToast } from '#app/components/toaster'
import { Input } from '#app/components/ui/input'
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	TooltipProvider,
} from '#app/components/ui/tooltip'
import {
	type AppearanceValuesMap,
	type AppearanceType,
	appearanceTypeValueSchema,
} from '#app/utils/appearances'
import { stringToHexcode, validateStringIsHexcode } from '#app/utils/colors'
import { useIsPending } from '#app/utils/misc'
import { INTENT, UpdateArtboardAppearanceValueSchema } from './actions'
import { type action } from './route'

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

	const AppearanceTypeValueSchema = appearanceTypeValueSchema(
		appearanceType as AppearanceType,
	)
	const Schema =
		AppearanceTypeValueSchema || UpdateArtboardAppearanceValueSchema

	const [form, fields] = useForm({
		id: `panel-update-artboard-appearance-${appearance.id}-value`,
		constraint: getFieldsetConstraint(Schema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			value: value.value,
		},
	})

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const parsedValue = stringToHexcode.parse(event.target.value)
		event.target.value = parsedValue
	}

	const handleSubmit = (event: FocusEvent<HTMLInputElement>) => {
		const isHexcode = validateStringIsHexcode(event.target.value)
		if (!isHexcode) {
			event.target.value = fields.value.defaultValue || ''
			quickToast({
				type: 'error',
				title: 'Invalid color',
				description: 'Please enter a valid color hexcode',
			})
			return
		}

		fetcher.submit(event.currentTarget.form, {
			method: 'POST',
		})
	}

	return (
		<fetcher.Form method="POST" {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="appearanceId" value={appearance.id} />
			<input type="hidden" name="appearanceType" value={appearanceType} />
			<input
				type="hidden"
				name="intent"
				value={INTENT.updateArtboardAppearanceValue}
			/>
			<div>
				<TooltipProvider delayDuration={2000}>
					<Tooltip>
						<TooltipTrigger asChild>
							<Input
								type="text"
								pattern="[A-F0-9]{6}"
								maxLength={6}
								className={'flex h-8'}
								onChange={e => handleChange(e)}
								onBlur={e => handleSubmit(e)}
								disabled={isPending}
								{...conform.input(fields.value, {
									ariaAttributes: true,
								})}
							/>
						</TooltipTrigger>
						<TooltipContent>{tooltipContent}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</fetcher.Form>
	)
}
