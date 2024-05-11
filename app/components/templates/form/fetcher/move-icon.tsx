import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { type z } from 'zod'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { actions } from '#app/routes/resources+/api.v1+/routes.server'
import {
	type IEntityId,
	type IEntityParentId,
	type entityParentIdTypeEnum,
} from '#app/schema/entity'
import { useIsPending } from '#app/utils/misc'
import { type RoutePath } from '#app/utils/routes.const'

export const FormFetcherMoveIcon = ({
	entityId,
	parentTypeId,
	parentId,
	route,
	formId,
	schema,
	direction,
	atTopOrBottom = false,
}: {
	entityId?: IEntityId
	parentTypeId: entityParentIdTypeEnum
	parentId: IEntityParentId
	route: RoutePath
	formId: string
	schema: z.ZodSchema<any>
	direction: 'up' | 'down'
	atTopOrBottom?: boolean
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
			<input type="hidden" name={parentTypeId} value={parentId} />
			<input type="hidden" name="direction" value={direction} />

			<PanelIconButton
				type="submit"
				iconName={`chevron-${direction}`}
				iconText={`Move ${direction}`}
				size="panel-sm"
				disabled={atTopOrBottom || isPending}
				className="my-0"
			/>
		</fetcher.Form>
	)
}
