import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { type z } from 'zod'
import { type IconName } from '#app/components/ui/icon'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { type IArtboardVersionWithDesignsAndLayers } from '#app/models/artboard-version/artboard-version.server'
import { type IDesignWithType } from '#app/models/design.server'
import {
	type designParentTypeIdEnum,
	type designTypeEnum,
} from '#app/schema/design'
import { useIsPending } from '#app/utils/misc'
import {
	type RoutePath,
	getLoaderType,
	getActionType,
} from '#app/utils/routes.utils'

export const FormFetcherIcon = ({
	entityId,
	type,
	parentTypeId,
	parentId,
	route,
	formId,
	schema,
	icon,
	iconText,
}: {
	entityId?: IDesignWithType['id']
	type?: designTypeEnum
	parentTypeId: designParentTypeIdEnum
	parentId: IArtboardVersionWithDesignsAndLayers['id']
	route: RoutePath
	formId: string
	schema: z.ZodSchema<any>
	icon: IconName
	iconText: string
}) => {
	const loader = getLoaderType(route)
	const action = getActionType(route)
	const fetcher = useFetcher<typeof loader>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form] = useForm({
		id: `${formId}-${parentId || 'parent'}-${entityId || 'new'}`,
		constraint: getFieldsetConstraint(schema),
		lastSubmission: actionData?.submission,
		onSubmit: async (event, { formData }) => {
			event.preventDefault()
			fetcher.submit(formData, {
				method: 'POST',
				action: route,
			})
		},
	})

	return (
		<fetcher.Form method="POST" action={route} {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			{entityId && <input type="hidden" name="id" value={entityId} />}
			<input type="hidden" name={parentTypeId} value={parentId} />
			{type && <input type="hidden" name="type" value={type} />}

			<PanelIconButton
				type="submit"
				iconName={icon}
				iconText={iconText}
				disabled={isPending}
			/>
		</fetcher.Form>
	)
}
