import { type IDesignEntityId } from '#app/models/design.server'
import { type panelEntityNewIntent } from '#app/routes/resources+/api.v1+/panel.form.new-entity'
import {
	type NewDesignSchemaType,
	type designParentTypeEnum,
	type designTypeEnum,
} from '#app/schema/design'

export const PanelFormNewEntity = ({
	type,
	parentType,
	parentId,
	schema,
	intent,
	iconText,
}: {
	type: designTypeEnum // or layer?? etc
	parentType: designParentTypeEnum
	parentId: IDesignEntityId
	schema: NewDesignSchemaType
	intent: panelEntityNewIntent
	iconText: string
}) => {
	return null
	// let isHydrated = useHydrated()
	// const newEntityFetcher = useFetcher<typeof loader>() // get loader from resource route
	// const actionData = useActionData<typeof action>() // get action from resource route
	// const isPending = useIsPending()
	// const [form] = useForm({
	// 	id: `panel-form-${parentType}-new-${type}`,
	// 	constraint: getFieldsetConstraint(schema),
	// 	lastSubmission: actionData?.submission,
	// 	onSubmit: async (event, { formData }) => {
	// 		event.preventDefault()
	// 		newEntityFetcher.submit(formData, {
	// 			method: 'POST',
	// 			action: actionPath, // get api route from constants
	// 		})
	// 	},
	// })

	// return (
	// 	<newEntityFetcher.Form method="POST" action={actionPath} {...form.props}>
	// 		<AuthenticityTokenInput />

	// 		<input type="hidden" name="no-js" value={String(!isHydrated)} />
	// 		<input type="hidden" name="parentId" value={parentId} />
	// 		<input type="hidden" name="type" value={type} />
	// 		<input type="hidden" name="intent" value={intent} />

	// 		<PanelIconButton
	// 			type="submit"
	// 			iconName="plus"
	// 			iconText={iconText}
	// 			disabled={isPending}
	// 		/>
	// 	</newEntityFetcher.Form>
	// )
}
