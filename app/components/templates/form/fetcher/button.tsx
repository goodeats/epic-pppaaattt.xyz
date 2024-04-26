import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { type z } from 'zod'
import { Icon, type IconName } from '#app/components/ui/icon'
import { StatusButton } from '#app/components/ui/status-button'
import {
	type entityParentIdTypeEnum,
	type IEntityParentId,
	type IEntityId,
	type IEntityType,
} from '#app/schema/entity'
import { useIsPending } from '#app/utils/misc'
import {
	type RoutePath,
	getLoaderType,
	getActionType,
} from '#app/utils/routes.utils'

export const FormFetcherButton = ({
	entityId,
	type,
	parentTypeId,
	parentId,
	route,
	formId,
	schema,
	icon,
	buttonText,
	buttonVariant = 'default',
}: {
	entityId?: IEntityId
	type?: IEntityType
	parentTypeId: entityParentIdTypeEnum
	parentId: IEntityParentId
	route: RoutePath
	formId: string
	schema: z.ZodSchema<any>
	icon: IconName
	buttonText: string
	buttonVariant?:
		| 'default'
		| 'link'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| null
		| undefined
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

			<StatusButton
				type="submit"
				variant={buttonVariant}
				status={isPending ? 'pending' : actionData?.status ?? 'idle'}
				disabled={isPending}
			>
				<Icon name={icon} className="scale-125 max-md:scale-150">
					<span className="max-md:hidden">{buttonText}</span>
				</Icon>
			</StatusButton>
		</fetcher.Form>
	)
}
