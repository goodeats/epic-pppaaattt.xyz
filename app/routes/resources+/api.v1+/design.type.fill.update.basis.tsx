import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useRef } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '#app/components/ui/select'
import { type IDesignWithFill } from '#app/models/design/design.server'
import {
	updateDesignTypeFillBasis,
	validateDesignTypeUpdateFillBasisSubmission,
} from '#app/models/design-type/fill/fill.update.server'
import { EntityParentIdType } from '#app/schema/entity'
import { EditDesignFillBasisSchema, FillBasisTypeEnum } from '#app/schema/fill'
import { validateNoJS } from '#app/schema/form-data'
import { requireUserId } from '#app/utils/auth.server'
import { useDebounce, useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'
import { transformEntityEnumValueForSelect } from '#app/utils/string-formatting'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.DESIGN.TYPE.FILL.UPDATE.BASIS
const schema = EditDesignFillBasisSchema

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const noJS = validateNoJS({ formData })

	let updateSuccess = false
	const { status, submission } =
		await validateDesignTypeUpdateFillBasisSubmission({
			userId,
			formData,
		})

	if (status === 'success') {
		const { success } = await updateDesignTypeFillBasis({
			userId,
			...submission.value,
		})
		updateSuccess = success
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission },
		{
			status: status === 'error' || !updateSuccess ? 404 : 200,
		},
	)
}

export const DesignTypeFillBasis = ({
	design,
	formLocation = '',
}: {
	design: IDesignWithFill
	formLocation?: string
}) => {
	const designId = design.id
	const fillId = design.fill.id
	const formId = `design-type-fill-update-basis-${designId}-${fillId}${
		formLocation ? `-${formLocation}` : ''
	}`
	const options = Object.values(FillBasisTypeEnum).map(fillBasisEnum => ({
		[fillBasisEnum]: transformEntityEnumValueForSelect(fillBasisEnum),
	}))

	const fetcher = useFetcher<typeof action>()
	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	let isHydrated = useHydrated()
	const [form, fields] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
		onValidate: ({ formData }) => {
			return parse(formData, { schema: schema })
		},
		onSubmit: async (event, { formData }) => {
			event.preventDefault()
			fetcher.submit(formData, {
				method: 'POST',
				action: route,
			})
		},
		defaultValue: {
			basis: design.fill.basis || '',
		},
	})
	const submitRef = useRef<HTMLButtonElement>(null)

	const handleChangeSubmit = useDebounce((f: HTMLFormElement) => {
		submitRef.current?.click()
	}, 400)

	return (
		<fetcher.Form
			method="POST"
			action={route}
			onChange={e => handleChangeSubmit(e.currentTarget)}
			{...form.props}
		>
			<AuthenticityTokenInput />

			<input type="hidden" name="no-js" value={String(!isHydrated)} />
			<input type="hidden" name="id" value={fillId} />
			<input
				type="hidden"
				name={EntityParentIdType.DESIGN_ID}
				value={designId}
			/>

			<div className="flex w-full items-center space-x-2">
				<Select disabled={isPending} {...conform.input(fields.basis)}>
					<SelectTrigger>
						<SelectValue placeholder="Select a basis" />
					</SelectTrigger>
					<SelectContent>
						{options.map((option, index) => {
							const [value, label] = Object.entries(option)[0]
							return (
								<SelectItem key={index} value={value}>
									{label}
								</SelectItem>
							)
						})}
					</SelectContent>
				</Select>

				{/* form onChange click this to trigger useForm */}
				<button type="submit" ref={submitRef} style={{ display: 'none' }}>
					Submit
				</button>
			</div>
		</fetcher.Form>
	)
}
