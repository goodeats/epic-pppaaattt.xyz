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
import { ArtboardDimensionsEditorSchema, INTENT } from './actions'
import { type action } from './route'

export const ArtboardDimensionsForm = ({
	artboard,
}: {
	artboard: SerializeFrom<Pick<Artboard, 'id' | 'width' | 'height'>>
}) => {
	const fetcher = useFetcher()

	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'edit-artboard-dimensions-form',
		constraint: getFieldsetConstraint(ArtboardDimensionsEditorSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			width: artboard.width ?? 1,
			height: artboard.height ?? 1,
		},
	})

	const handleSubmit = (event: FocusEvent<HTMLInputElement>) => {
		const relatedTarget = event.relatedTarget as HTMLInputElement | null

		if (relatedTarget?.name === 'width' || relatedTarget?.name === 'height')
			return

		fetcher.submit(event.currentTarget.form, {
			method: 'POST',
		})
	}

	const FormWidth = () => {
		return (
			<Field
				labelProps={{ children: 'Width' }}
				inputProps={{
					...conform.input(fields.width, {
						ariaAttributes: true,
						type: 'number',
					}),
					autoComplete: 'off',
					onBlur: e => {
						handleSubmit(e)
					},
					disabled: isPending,
				}}
				errors={fields.width.errors}
			/>
		)
	}

	const FormHeight = () => {
		return (
			<Field
				labelProps={{ children: 'Height' }}
				inputProps={{
					...conform.input(fields.height, {
						ariaAttributes: true,
						type: 'number',
					}),
					autoComplete: 'off',
					onBlur: e => {
						handleSubmit(e)
					},
					disabled: isPending,
				}}
				errors={fields.height.errors}
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
								value={INTENT.updateArtboardDimensions}
							/>

							<div
								id="dimensions-form"
								className="grid w-full grid-cols-2 gap-4"
							>
								<FormWidth />
								<FormHeight />
							</div>
							<ErrorList id={form.errorId} errors={form.errors} />
						</fetcher.Form>
					</FormContainer>
				</SideNavFormHoverTrigger>
				<SideNavFormHoverContent>
					Controls dimensions: set height and width of the artboard canvas. Note
					that the canvas to the left is to scale and will download at full
					size.
				</SideNavFormHoverContent>
			</HoverCard>
		</SideNavFormWrapper>
	)
}
