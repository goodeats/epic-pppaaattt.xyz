import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { type z } from 'zod'
import { type IconName } from '#app/components/ui/icon'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { actions } from '#app/routes/resources+/api.v1+/routes.server'
import {
	type entityParentIdTypeEnum,
	type IEntityParentId,
	type IEntityId,
	type IEntityType,
} from '#app/schema/entity'
import { useIsPending } from '#app/utils/misc'
import { type RoutePath } from '#app/utils/routes.const'

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
	className,
}: {
	entityId?: IEntityId
	type?: IEntityType
	parentTypeId?: entityParentIdTypeEnum
	parentId?: IEntityParentId
	route: RoutePath
	formId: string
	schema: z.ZodSchema<any>
	icon: IconName
	iconText: string
	className?: string
}) => {
	const action = actions[route]
	const fetcher = useFetcher<typeof action>()
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
			{parentId && parentTypeId && (
				<input type="hidden" name={parentTypeId} value={parentId} />
			)}
			{type && <input type="hidden" name="type" value={type} />}

			<PanelIconButton
				type="submit"
				className={className}
				iconName={icon}
				iconText={iconText}
				disabled={isPending}
			/>
		</fetcher.Form>
	)
}
