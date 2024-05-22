import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type Project } from '@prisma/client'
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
import { useIsPending } from '#app/utils/misc.tsx'
import { type action } from './edit-project-form.server'

const titleMinLength = 1
const titleMaxLength = 100
const descriptionMinLength = 1
const descriptionMaxLength = 10000

export const ProjectEditorSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(titleMinLength).max(titleMaxLength),
	description: z.string().min(descriptionMinLength).max(descriptionMaxLength),
	// if unchecked isVisble will not be included in the submission
	// so set to false if so
	isVisible: z.boolean().optional(),
})

export function EditProjectForm({
	project,
}: {
	project: SerializeFrom<
		Pick<Project, 'id' | 'name' | 'description' | 'isVisible'>
	>
}) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'edit-project-form',
		constraint: getFieldsetConstraint(ProjectEditorSchema),
		lastSubmission: actionData?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: ProjectEditorSchema })
		},
		defaultValue: {
			name: project.name ?? '',
			description: project.description ?? '',
			isVisible: project.isVisible ?? false,
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
				<input type="hidden" name="id" value={project.id} />
				<FormFieldsContainer>
					<FormName />
					<FormDescription />
					<FormIsVisible />
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
					<p>No project with the id "{params.projectId}" exists</p>
				),
			}}
		/>
	)
}
