import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { json, redirect, type ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { CheckboxField, ErrorList } from '#app/components/forms.tsx'
import {
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
import { useIsPending } from '#app/utils/misc.tsx'
import { assignAppearancesToArtboard } from './mutations'
import { type loader } from './route'

const ArtboardAppearancesEditorSchema = z.object({
	artboardId: z.string(),
	appearanceIds: z.string().array(),
})

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await request.formData()
	await validateCSRF(formData, request.headers)

	const submission = await parse(formData, {
		schema: ArtboardAppearancesEditorSchema.superRefine(async (data, ctx) => {
			const artboard = await prisma.artboard.findUnique({
				select: { id: true },
				where: { id: data.artboardId, ownerId: userId },
			})
			if (!artboard) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Artboard not found',
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

	const { artboardId, appearanceIds } = submission.value

	const updatedArtboard = await assignAppearancesToArtboard(
		userId,
		artboardId,
		appearanceIds,
	)

	if (!updatedArtboard) {
		return json({ submission } as const, { status: 400 })
	}

	const { owner } = updatedArtboard
	return redirect(`/users/${owner.username}/artboards/${updatedArtboard.slug}`)
}

export function AssignAppearancesForm() {
	const data = useLoaderData<typeof loader>()
	const { artboard, appearances } = data
	const artboardAppearanceIds = artboard.appearances.map(
		artboard => artboard.appearanceId,
	)

	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'choose-appearances-form',
		constraint: getFieldsetConstraint(ArtboardAppearancesEditorSchema),
		lastSubmission: actionData?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: ArtboardAppearancesEditorSchema })
		},
		defaultValue: {
			appearanceIds: artboardAppearanceIds ?? [],
		},
	})

	const Appearances = () => {
		return (
			<div className="flex items-center justify-between space-x-2">
				<fieldset>
					<legend className="mb-4 text-lg">Appearances</legend>
					{appearances.map((appearance, i) => {
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
									children: `${appearance.name} (${appearance.type})`,
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
					<Appearances />
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
					<p>No artboard with the id "{params.artboardId}" exists</p>
				),
			}}
		/>
	)
}
