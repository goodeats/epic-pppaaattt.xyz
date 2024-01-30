import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type Artboard } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'
import { useActionData, useFetcher } from '@remix-run/react'
import { type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { ErrorList, Field } from '#app/components/forms'
import {
	FormContainer,
	SideNavFormHoverContent,
	SideNavFormHoverTrigger,
	SideNavFormWrapper,
} from '#app/components/shared'
import { HoverCard } from '#app/components/ui/hover-card'
import { useIsPending } from '#app/utils/misc'
import { ArtboardBackgroundColorEditorSchema, INTENT } from './actions'
import { type action } from './route'

export const ArtboardBackgroundColorForm = ({
	artboard,
}: {
	artboard: SerializeFrom<Pick<Artboard, 'id' | 'backgroundColor'>>
}) => {
	const fetcher = useFetcher()

	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'edit-artboard-background-color-form',
		constraint: getFieldsetConstraint(ArtboardBackgroundColorEditorSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			backgroundColor: artboard.backgroundColor ?? '#FFFFFF',
		},
	})

	const handleSubmit = (event: FocusEvent<HTMLInputElement>) => {
		fetcher.submit(event.currentTarget.form, {
			method: 'POST',
		})
	}

	const FormBackgroundColor = () => {
		return (
			<Field
				labelProps={{ children: 'Background Color' }}
				inputProps={{
					...conform.input(fields.backgroundColor, {
						ariaAttributes: true,
					}),
					autoComplete: 'off',
					onBlur: e => {
						handleSubmit(e)
					},
					disabled: isPending,
				}}
				errors={fields.backgroundColor.errors}
			/>
		)
	}

	return (
		<SideNavFormWrapper>
			<HoverCard openDelay={200}>
				<SideNavFormHoverTrigger>
					<FormContainer>
						<fetcher.Form method="POST" {...form.props}>
							<AuthenticityTokenInput />
							{/*
                This hidden submit button is here to ensure that when the user hits
                "enter" on an input field, the primary form function is submitted
                rather than the first button in the form (which is delete/add image).
              */}
							<button type="submit" className="hidden" />
							<input type="hidden" name="id" value={artboard.id} />
							<input
								type="hidden"
								name="intent"
								value={INTENT.updateArtboardBackgroundColor}
							/>

							<FormBackgroundColor />
							<ErrorList id={form.errorId} errors={form.errors} />
						</fetcher.Form>
					</FormContainer>
				</SideNavFormHoverTrigger>
				<SideNavFormHoverContent>
					Controls background color: set background color of the artboard
					canvas. Note to self: make this a palette.
				</SideNavFormHoverContent>
			</HoverCard>
		</SideNavFormWrapper>
	)
}
