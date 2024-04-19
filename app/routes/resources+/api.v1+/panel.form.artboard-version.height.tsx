import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import {
	type LoaderFunctionArgs,
	json,
	type DataFunctionArgs,
} from '@remix-run/node'
import { useActionData, useFetcher } from '@remix-run/react'
import { type FocusEvent } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { Icon } from '#app/components/ui/icon'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { validateArtboardVersionHeightSubmission } from '#app/models/artboard-version/artboard-version.update.server'
import { ArtboardVersionHeightSchema } from '#app/schema/artboard-version'
import { validateNoJS } from '#app/schema/form-data'
import { updateArtboardVersionHeightService } from '#app/services/artboard/version/update.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

const actionPath = '/resources/api/v1/panel/form/artboard-version/height'
export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	const { status, submission } = await validateArtboardVersionHeightSubmission({
		userId,
		formData,
	})
	let updateSucess = false
	if (status === 'success') {
		const { success } = await updateArtboardVersionHeightService({
			...submission.value,
		})
		updateSucess = success
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission },
		{ status: status === 'error' || !updateSucess ? 400 : 200 },
	)
}

export const PanelFormArtboardVersionHeight = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	const heightFetcher = useFetcher<typeof loader>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form, fields] = useForm({
		id: 'panel-form-artboard-version-height',
		constraint: getFieldsetConstraint(ArtboardVersionHeightSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...version,
		},
	})

	const handleSubmit = (event: FocusEvent<HTMLInputElement>) => {
		heightFetcher.submit(event.currentTarget.form, {
			method: 'POST',
			action: actionPath,
		})
	}

	return (
		<heightFetcher.Form method="POST" action={actionPath} {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			<input type="hidden" name="id" value={version.id} />
			<div className="flex w-full items-center space-x-2">
				<Label htmlFor={fields.height.id} className="w-5 flex-shrink-0">
					<Icon name="height" className="h-5 w-5" />
				</Label>
				<Input
					type="number"
					className="flex h-8"
					onBlur={e => handleSubmit(e)}
					disabled={isPending}
					{...conform.input(fields.height, {
						ariaAttributes: true,
					})}
				/>
			</div>
		</heightFetcher.Form>
	)
}
