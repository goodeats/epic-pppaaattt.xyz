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
import {
	SidebarPanel,
	SidebarPanelHeader,
	SidebarPanelRow,
	SidebarPanelRowContainer,
} from '#app/components/templates'
import { Icon } from '#app/components/ui/icon'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { ArtboardVersionWidthSchema } from '#app/schema/artboard-version'
import { updateArtboardVersionWidthService } from '#app/services/artboard/version/update.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const actionArgs = { request, userId, formData }

	return await updateArtboardVersionWidthService(actionArgs)
}

export const PanelArtboardVersionWidth = ({
	version,
}: {
	version: IArtboardVersionWithDesignsAndLayers
}) => {
	const widthFetcher = useFetcher<typeof loader>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	const [form, fields] = useForm({
		id: 'panel-form-artboard-width',
		constraint: getFieldsetConstraint(ArtboardVersionWidthSchema),
		lastSubmission: actionData?.submission,
		defaultValue: {
			...version,
		},
	})

	const handleSubmit = (event: FocusEvent<HTMLInputElement>) => {
		widthFetcher.submit(event.currentTarget.form, {
			method: 'POST',
			action: '/resources/panel/artboard-version/width',
		})
	}

	return (
		<SidebarPanel>
			<SidebarPanelHeader title="Width" />
			<SidebarPanelRow>
				<SidebarPanelRowContainer>
					<widthFetcher.Form method="POST" {...form.props}>
						<AuthenticityTokenInput />

						<input type="hidden" name="id" value={version.id} />
						<input type="hidden" name="intent" value="update-width" />
						<div className="flex w-full items-center space-x-2">
							<Label htmlFor={fields.width.id} className="w-5 flex-shrink-0">
								<Icon name="width" className="h-5 w-5" />
							</Label>
							<Input
								type="number"
								className="flex h-8"
								onBlur={e => handleSubmit(e)}
								disabled={isPending}
								{...conform.input(fields.width, {
									ariaAttributes: true,
								})}
							/>
						</div>
					</widthFetcher.Form>
				</SidebarPanelRowContainer>
			</SidebarPanelRow>
		</SidebarPanel>
	)
}
