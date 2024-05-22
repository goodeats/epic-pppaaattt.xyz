import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type Artwork } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import {
	CheckboxField,
	ErrorList,
	Field,
	TextareaField,
} from '#app/components/forms.tsx'
import {
	FooterLinkButton,
	FormActionsContainer,
	FormContainer,
	FormFieldsContainer,
	formDefaultClassName,
} from '#app/components/shared'
import { Button } from '#app/components/ui/button.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import {
	formatSringsToHex,
	validateStringsAreHexcodes,
} from '#app/utils/colors'
import { useIsPending } from '#app/utils/misc.tsx'
import {
	capitalize,
	removeWhitespace,
	trimSpacesInBetween,
} from '#app/utils/string-formatting'
import { type action } from './edit-form.server'

const titleMinLength = 1
const titleMaxLength = 100
const descriptionMinLength = 1
const descriptionMaxLength = 10000
const widthMinLength = 1
const widthMaxLength = 10000
const heightMinLength = 1
const heightMaxLength = 10000

export const ArtworkEditorSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(titleMinLength).max(titleMaxLength),
	description: z.string().min(descriptionMinLength).max(descriptionMaxLength),
	// if unchecked isVisble will not be included in the submission
	// so set to false if so
	isVisible: z.boolean().optional(),
	width: z.number().min(widthMinLength).max(widthMaxLength),
	height: z.number().min(heightMinLength).max(heightMaxLength),
	// backgroundColor: z.string(),
	// HexcodeStringSchema,
	backgroundColor: z
		.string()
		.transform(val => removeWhitespace(val))
		.transform(val => capitalize(val))
		.transform(val => trimSpacesInBetween(val))
		.transform(val => formatSringsToHex(val.split(',')))
		.refine(validateStringsAreHexcodes, {
			message: 'Values must be valid hexcodes',
		}),
})

export function EditForm({
	artwork,
}: {
	artwork: SerializeFrom<
		Pick<
			Artwork,
			| 'id'
			| 'name'
			| 'description'
			| 'isVisible'
			| 'width'
			| 'height'
			| 'backgroundColor'
		>
	>
}) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'edit-artwork-form',
		constraint: getFieldsetConstraint(ArtworkEditorSchema),
		lastSubmission: actionData?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: ArtworkEditorSchema })
		},
		defaultValue: {
			name: artwork.name ?? '',
			description: artwork.description ?? '',
			isVisible: artwork.isVisible ?? false,
			width: artwork.width ?? 1080, // 9:16
			height: artwork.height ?? 1920,
			backgroundColor: artwork.backgroundColor ?? '#FFFFFF',
		},
	})

	const FormName = () => {
		return (
			<Field
				labelProps={{ children: 'Name' }}
				inputProps={{
					autoFocus: true,
					...conform.input(fields.name, { ariaAttributes: true }),
				}}
				errors={fields.name.errors}
			/>
		)
	}

	const FormDescription = () => {
		return (
			<TextareaField
				labelProps={{ children: 'Description' }}
				textareaProps={{
					...conform.textarea(fields.description, { ariaAttributes: true }),
				}}
				errors={fields.description.errors}
			/>
		)
	}

	const FormIsVisible = () => {
		return (
			<CheckboxField
				labelProps={{
					htmlFor: fields.isVisible.id,
					children: 'Visible',
				}}
				buttonProps={conform.input(fields.isVisible, {
					type: 'checkbox',
				})}
				defaultChecked={!!fields.isVisible.defaultValue}
				errors={fields.isVisible.errors}
			/>
		)
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
				}}
				errors={fields.height.errors}
			/>
		)
	}

	const FormBackgroundColor = () => {
		return (
			<Field
				labelProps={{ children: 'Background Color' }}
				inputProps={{
					...conform.input(fields.backgroundColor, {
						ariaAttributes: true,
					}),
				}}
				errors={fields.backgroundColor.errors}
			/>
		)
	}

	const FormActions = () => {
		return (
			<FormActionsContainer>
				<FooterLinkButton to=".." icon="arrow-left" variant="outline">
					Cancel
				</FooterLinkButton>
				<Button form={form.id} variant="destructive" type="reset">
					Reset
				</Button>
				<StatusButton
					form={form.id}
					type="submit"
					disabled={isPending}
					status={isPending ? 'pending' : 'idle'}
				>
					Submit
				</StatusButton>
			</FormActionsContainer>
		)
	}

	return (
		<FormContainer>
			<Form
				method="POST"
				className={formDefaultClassName}
				{...form.props}
				encType="multipart/form-data"
			>
				<AuthenticityTokenInput />
				{/*
					This hidden submit button is here to ensure that when the user hits
					"enter" on an input field, the primary form function is submitted
					rather than the first button in the form (which is delete/add image).
				*/}
				<button type="submit" className="hidden" />
				<input type="hidden" name="id" value={artwork.id} />
				<FormFieldsContainer>
					<FormName />
					<FormDescription />
					<FormIsVisible />
					<FormWidth />
					<FormHeight />
					<FormBackgroundColor />
				</FormFieldsContainer>
				<ErrorList id={form.errorId} errors={form.errors} />
			</Form>
			<FormActions />
		</FormContainer>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No artwork with the id "{params.artworkId}" exists</p>
				),
			}}
		/>
	)
}
