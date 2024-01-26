import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { json, redirect, type ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { ErrorList, Field } from '#app/components/forms.tsx'
import {
	FormActionsContainer,
	FormContainer,
	FormFieldsContainer,
	formDefaultClassName,
} from '#app/components/shared'
import { Button } from '#app/components/ui/button.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import {
	formatSringsToHex,
	validateStringsAreHexcodes,
} from '#app/utils/colors'
import { validateCSRF } from '#app/utils/csrf.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { stringToSlug, useIsPending } from '#app/utils/misc.tsx'
import {
	capitalize,
	removeWhitespace,
	trimSpacesInBetween,
} from '#app/utils/string-formatting'
import { type loader } from './route'

const titleMinLength = 1
const titleMaxLength = 100
const descriptionMinLength = 1
const descriptionMaxLength = 10000
const widthMinLength = 1
const widthMaxLength = 10000
const heightMinLength = 1
const heightMaxLength = 10000

const ArtboardEditorSchema = z.object({
	projectId: z.string(),
	name: z.string().min(titleMinLength).max(titleMaxLength),
	description: z.string().min(descriptionMinLength).max(descriptionMaxLength),
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

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await request.formData()
	await validateCSRF(formData, request.headers)

	const submission = await parse(formData, {
		schema: ArtboardEditorSchema.superRefine(async (data, ctx) => {
			const project = await prisma.project.findUnique({
				select: { id: true },
				where: { id: data.projectId, ownerId: userId },
			})
			if (!project) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Project not found',
				})
			}

			const slug = stringToSlug(data.name)
			const artboardWithSlug = await prisma.artboard.findFirst({
				select: { id: true },
				where: { slug, ownerId: userId },
			})
			if (artboardWithSlug) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Artboard with that name already exists',
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

	const { projectId, name, description, width, height, backgroundColor } =
		submission.value
	const slug = stringToSlug(name)

	const createdArtboard = await prisma.artboard.create({
		select: {
			slug: true,
			owner: { select: { username: true } },
			project: { select: { slug: true } },
		},
		data: {
			ownerId: userId,
			projectId,
			name,
			description,
			slug,
			width,
			height,
			backgroundColor: backgroundColor[0],
		},
	})

	const { owner } = createdArtboard
	return redirect(`/users/${owner.username}/artboards/${createdArtboard.slug}`)
}

export function AddLayerForm() {
	const data = useLoaderData<typeof loader>()
	const artboard = data.artboard

	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'add-layer-form',
		constraint: getFieldsetConstraint(ArtboardEditorSchema),
		lastSubmission: actionData?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: ArtboardEditorSchema })
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

	const FormActions = () => {
		return (
			<FormActionsContainer>
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
				<input type="hidden" name="artboardId" value={artboard.id} />
				<FormFieldsContainer>
					<FormName />
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
