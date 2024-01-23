import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { json, redirect, type ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { floatingToolbarClassName } from '#app/components/floating-toolbar.tsx'
import { ErrorList, Field, TextareaField } from '#app/components/forms.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { validateCSRF } from '#app/utils/csrf.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { useIsPending } from '#app/utils/misc.tsx'

const titleMinLength = 1
const titleMaxLength = 100
const descriptionMinLength = 1
const descriptionMaxLength = 10000

const ProjectEditorSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(titleMinLength).max(titleMaxLength),
	description: z.string().min(descriptionMinLength).max(descriptionMaxLength),
})

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await request.formData()
	await validateCSRF(formData, request.headers)

	const submission = await parse(formData, {
		schema: ProjectEditorSchema,
		async: true,
	})

	if (submission.intent !== 'submit') {
		return json({ submission } as const)
	}

	if (!submission.value) {
		return json({ submission } as const, { status: 400 })
	}

	const { name, description } = submission.value

	const createdProject = await prisma.project.create({
		select: { id: true, owner: { select: { username: true } } },
		data: {
			ownerId: userId,
			name,
			description,
		},
	})

	return redirect(
		`/users/${createdProject.owner.username}/projects/${createdProject.id}`,
	)
}

export function NewProjectForm() {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'new-project-form',
		constraint: getFieldsetConstraint(ProjectEditorSchema),
		lastSubmission: actionData?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: ProjectEditorSchema })
		},
	})

	return (
		<div className="absolute inset-0">
			<Form
				method="POST"
				className="flex h-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-10 pb-28 pt-12"
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
				<div className="flex flex-col gap-1">
					<Field
						labelProps={{ children: 'Name' }}
						inputProps={{
							autoFocus: true,
							...conform.input(fields.name, { ariaAttributes: true }),
						}}
						errors={fields.name.errors}
					/>
					<TextareaField
						labelProps={{ children: 'Description' }}
						textareaProps={{
							...conform.textarea(fields.description, { ariaAttributes: true }),
						}}
						errors={fields.description.errors}
					/>
				</div>
				<ErrorList id={form.errorId} errors={form.errors} />
			</Form>
			<div className={floatingToolbarClassName}>
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
			</div>
		</div>
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
