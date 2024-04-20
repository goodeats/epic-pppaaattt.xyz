import { useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import {
	type LoaderFunctionArgs,
	json,
	type DataFunctionArgs,
} from '@remix-run/node'
import { useActionData, useFetcher } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { validateArtboardVersionNewDesignSubmission } from '#app/models/design-artboard-version/design-artboard-version.create.server'
import { type IDesignEntityId } from '#app/models/design.server'
import {
	type NewDesignSchemaType,
	type designParentTypeEnum,
	type designTypeEnum,
} from '#app/schema/design'
import { fakeSubmission, validateNoJS } from '#app/schema/form-data'
import { artboardVersionDesignCreateService } from '#app/services/artboard/version/design/create.service'
import { requireUserId } from '#app/utils/auth.server'
import { useIsPending } from '#app/utils/misc'
import { type ObjectValues } from '#app/utils/typescript-helpers'

// https://www.epicweb.dev/full-stack-components

export const PANEL_ENTITY_NEW_INTENT = {
	createArtboardVersionDesignType:
		'create-artboard-version-design-type' as const,
}
export type panelEntityNewIntent = ObjectValues<typeof PANEL_ENTITY_NEW_INTENT>

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

const actionPath = '/resources/api/v1/panel/form/new-entity'
export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const intent = formData.get('intent')
	const noJS = validateNoJS({ formData })

	let result
	let updateSucess = false
	switch (intent) {
		case PANEL_ENTITY_NEW_INTENT.createArtboardVersionDesignType: {
			// reconsidering making more typical CRUD named routes in api/v1

			const { status, submission } =
				await validateArtboardVersionNewDesignSubmission({
					userId,
					formData,
				})

			if (status === 'success') {
				const { success } = await artboardVersionDesignCreateService({
					userId,
					...submission.value,
				})
				updateSucess = success
			}

			if (noJS) {
				throw redirectBack(request, {
					fallback: '/',
				})
			}

			return json(result, {
				status: status === 'error' || !updateSucess ? 422 : 201,
			})
		}
		default: {
			console.log('no intent')
			result = { status: 'error', submission: fakeSubmission({ formData }) }

			if (noJS) {
				throw redirectBack(request, {
					fallback: '/',
				})
			}

			return json(result, {
				status: result.status === 'error' || !updateSucess ? 422 : 201,
			})
		}
	}
}

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
	let isHydrated = useHydrated()
	const newEntityFetcher = useFetcher<typeof loader>()
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	const [form] = useForm({
		id: `panel-form-${parentType}-new-${type}`,
		constraint: getFieldsetConstraint(schema),
		lastSubmission: actionData?.submission,
		onSubmit: async (event, { formData }) => {
			event.preventDefault()
			newEntityFetcher.submit(formData, {
				method: 'POST',
				action: actionPath,
			})
		},
	})

	return (
		<newEntityFetcher.Form method="POST" action={actionPath} {...form.props}>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			<input type="hidden" name="parentId" value={parentId} />
			<input type="hidden" name="type" value={type} />
			<input type="hidden" name="intent" value={intent} />

			<PanelIconButton
				type="submit"
				iconName="plus"
				iconText={iconText}
				disabled={isPending}
			/>
		</newEntityFetcher.Form>
	)
}
