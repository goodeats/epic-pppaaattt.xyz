import { conform, useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { type Appearance, type Artboard } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'
import { useActionData, useFetcher, useLoaderData } from '@remix-run/react'
import { useEffect } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { CheckboxField } from '#app/components/forms'
import {
	DialogFormFieldsContainer,
	FormContainer,
} from '#app/components/shared'
import { Button } from '#app/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '#app/components/ui/dialog'
import { Icon } from '#app/components/ui/icon'
import { type AppearanceType } from '#app/utils/appearances'
import { downloadCanvasAsPNG } from '#app/utils/download'
import { ArtboardAppearancesAddEditorSchema, INTENT } from './actions'
import { type loader, type action } from './route'

export function AddArtboardAppearanceForm({
	artboard,
	artboardAppearances,
	appearanceType,
}: {
	artboard: SerializeFrom<Pick<Artboard, 'id' | 'width' | 'height'>>
	artboardAppearances: Array<
		Pick<Appearance, 'id' | 'name' | 'description' | 'type' | 'value'>
	>
	appearanceType: AppearanceType
}) {
	const data = useLoaderData<typeof loader>()
	const { appearances } = data
	const appearancesByType = appearances.filter(
		appearance => appearance.type === appearanceType,
	)
	const artboardAppearanceIds = artboardAppearances.map(artboard => artboard.id)

	const fetcher = useFetcher()

	useEffect(() => {
		console.log('AddArtboardAppearanceForm')
	}, [])

	const actionData = useActionData<typeof action>()
	// const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'add-artboard-appearance',
		lastSubmission: actionData?.submission,
		onSubmit: (event, { formData }) => {
			event.preventDefault()

			const submission = parse(formData, {
				schema: ArtboardAppearancesAddEditorSchema,
			})
			if (!submission.value) {
				console.warn('no submission', submission)
				return
			}

			downloadCanvasAsPNG()

			fetcher.submit(formData, {
				method: 'POST',
			})
		},
		defaultValue: {
			appearanceIds: artboardAppearanceIds ?? [],
		},
	})

	if (!artboard) return null

	const Appearances = () => {
		return (
			<div className="flex items-center justify-between space-x-2">
				<fieldset>
					<legend className="mb-4 text-lg">Appearances</legend>
					{appearancesByType.map((appearance, i) => {
						const checkboxProps = conform.input(fields.appearanceIds, {
							type: 'checkbox',
							value: appearance.id,
						})

						// mutliple bug since checkbox is a button actually
						const { multiple, ...rest } = checkboxProps

						return (
							<CheckboxField
								key={appearance.id}
								labelProps={{
									htmlFor: checkboxProps.id,
									children: `${appearance.name}`,
								}}
								buttonProps={rest}
								defaultChecked={artboardAppearanceIds.includes(appearance.id)}
								errors={fields.appearanceIds.errors}
							/>
						)
					})}
				</fieldset>
			</div>
		)
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Icon name="plus" className="scale-125">
						Add Palette
					</Icon>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add palette</DialogTitle>
					<DialogDescription>
						Assign a palette to your artboard here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<FormContainer>
						<fetcher.Form method="POST" {...form.props}>
							<AuthenticityTokenInput />
							{/*
                This hidden submit button is here to ensure that when the user hits
                "enter" on an input field, the primary form function is submitted
                rather than the first button in the form (which is delete/add image).
              */}
							<button type="submit" className="hidden" />
							<input type="hidden" name="artboardId" value={artboard.id} />
							<input
								type="hidden"
								name="intent"
								value={INTENT.updateArtboardAppearancesAdd}
							/>
							<DialogFormFieldsContainer className="grid-cols-1">
								<Appearances />
							</DialogFormFieldsContainer>
						</fetcher.Form>
					</FormContainer>
				</div>
				<DialogFooter>
					<Button type="submit">Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
