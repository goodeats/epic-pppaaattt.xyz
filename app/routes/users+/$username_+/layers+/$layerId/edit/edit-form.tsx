import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type Layer } from '@prisma/client'
import {
	json,
	redirect,
	type ActionFunctionArgs,
	type SerializeFrom,
} from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { ErrorList, Field, TextareaField } from '#app/components/forms.tsx'
import {
	FooterLinkButton,
	FormActionsContainer,
	FormContainer,
	FormFieldsContainer,
	formDefaultClassName,
} from '#app/components/shared'
import { Button } from '#app/components/ui/button.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { validateCSRF } from '#app/utils/csrf.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { stringToSlug, useIsPending } from '#app/utils/misc.tsx'
import { capitalizeFirstLetter } from '#app/utils/string-formatting'

const entityName = 'layer'
const titleMinLength = 1
const titleMaxLength = 100
const descriptionMinLength = 1
const descriptionMaxLength = 10000

const LayerEditorSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(titleMinLength).max(titleMaxLength),
	description: z.string().min(descriptionMinLength).max(descriptionMaxLength),
})

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await request.formData()
	await validateCSRF(formData, request.headers)

	const submission = await parse(formData, {
		schema: LayerEditorSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const layer = await prisma.layer.findUnique({
				select: { id: true },
				where: { id: data.id, ownerId: userId },
			})
			if (!layer) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `${capitalizeFirstLetter(entityName)} not found`,
				})
			}

			const slug = stringToSlug(data.name)
			const entityWithSlug = await prisma.layer.findFirst({
				select: { id: true },
				where: { slug, ownerId: userId },
			})
			if (entityWithSlug && entityWithSlug.id !== data.id) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `${capitalizeFirstLetter(
						entityName,
					)} with that name already exists`,
				})
			}
		}),
		async: true,
	})

	if (submission.intent !== 'submit') {
		return json({ submission } as const)
	}

	if (!submission.value) {
		return json({ submission } as const, { status: 400 })
	}

	const { id: layerId, name, description } = submission.value
	const slug = stringToSlug(name)

	const updatedEntity = await prisma.layer.update({
		select: { slug: true, owner: { select: { username: true } } },
		where: { id: layerId },
		data: {
			name,
			description,
			slug,
		},
	})

	return redirect(
		`/users/${updatedEntity.owner.username}/${entityName}s/${updatedEntity.slug}`,
	)
}

export function EditForm({
	layer,
}: {
	layer: SerializeFrom<Pick<Layer, 'id' | 'name' | 'description'>>
}) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: `edit-${entityName}-form`,
		constraint: getFieldsetConstraint(LayerEditorSchema),
		lastSubmission: actionData?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: LayerEditorSchema })
		},
		defaultValue: {
			name: layer.name ?? '',
			description: layer.description ?? '',
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
				<input type="hidden" name="id" value={layer.id} />
				<FormFieldsContainer>
					<FormName />
					<FormDescription />
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
					<p>No layer with the id "{params.layerId}" exists</p>
				),
			}}
		/>
	)
}
