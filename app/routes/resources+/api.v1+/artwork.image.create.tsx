import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	unstable_createMemoryUploadHandler as createMemoryUploadHandler,
	unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { redirectBack } from 'remix-utils/redirect-back'
import { useHydrated } from 'remix-utils/use-hydrated'
import { ErrorList, TextareaField } from '#app/components/forms'
import {
	DialogContentGrid,
	DialogFormsContainer,
} from '#app/components/layout/dialog'
import { TooltipHydrated } from '#app/components/templates/tooltip'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '#app/components/ui/dialog'
import { Icon } from '#app/components/ui/icon'
import { Label } from '#app/components/ui/label'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { StatusButton } from '#app/components/ui/status-button'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { validateNewArtworkImageSubmission } from '#app/models/images/artwork-image.create.server'
import {
	NewArtworkImageSchema,
	MAX_UPLOAD_SIZE,
} from '#app/schema/artwork-image'
import { validateNoJS } from '#app/schema/form-data'
import { artworkImageCreateService } from '#app/services/artwork/image/create.service'
import { requireUserId } from '#app/utils/auth.server'
import { cn, useIsPending } from '#app/utils/misc'
import { Routes } from '#app/utils/routes.const'

// https://www.epicweb.dev/full-stack-components

const route = Routes.RESOURCES.API.V1.ARTWORK.IMAGE.CREATE
const schema = NewArtworkImageSchema

// auth GET request to endpoint
export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	console.log('action 🚨')
	const userId = await requireUserId(request)
	const formData = await parseMultipartFormData(
		request,
		createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	)
	const noJS = validateNoJS({ formData })

	let createSuccess = false
	let errorMessage = ''
	const { status, submission } = await validateNewArtworkImageSubmission({
		userId,
		formData,
	})

	if (status === 'success') {
		console.log('gonna create 🚨')
		const { success, message } = await artworkImageCreateService({
			userId,
			...submission.value,
		})
		createSuccess = success
		errorMessage = message || ''
	}

	if (noJS) {
		throw redirectBack(request, {
			fallback: '/',
		})
	}

	return json(
		{ status, submission, message: errorMessage },
		{
			status: status === 'error' || !createSuccess ? 422 : 201,
		},
	)
}

export const ArtworkImageCreate = ({ artwork }: { artwork: IArtwork }) => {
	const artworkId = artwork.id
	const [open, setOpen] = useState(false)
	const [previewImage, setPreviewImage] = useState<string | null>(null)
	const [altText] = useState('New Image...')

	const fetcher = useFetcher<typeof action>()
	const isPending = useIsPending()
	let isHydrated = useHydrated()

	const [form, fields] = useForm({
		id: `artwork-image-create-${artworkId}`,
		constraint: getFieldsetConstraint(schema),
		lastSubmission: fetcher.data?.submission,
		onValidate: ({ formData }) => {
			return parse(formData, { schema })
		},
		defaultValue: {
			image: {},
			altText: '',
		},
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<TooltipHydrated tooltipText="New image..." isHydrated={isHydrated}>
				<DialogTrigger asChild>
					<PanelIconButton iconName="plus" iconText="New Image" />
				</DialogTrigger>
			</TooltipHydrated>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add a new image</DialogTitle>
					<DialogDescription>
						Add an image to the artwork that can be used on many layers,
						branches, and versions.
					</DialogDescription>
				</DialogHeader>
				<DialogContentGrid>
					<fetcher.Form
						method="POST"
						encType="multipart/form-data"
						action={route}
						{...form.props}
					>
						<AuthenticityTokenInput />

						<input type="hidden" name="no-js" value={String(!isHydrated)} />
						<input type="hidden" name="artworkId" value={artworkId} />

						<DialogFormsContainer>
							<Label>Image</Label>
							<div className="flex gap-3">
								<div className="w-32">
									<div className="relative h-32 w-32">
										<label
											htmlFor={fields.file.id}
											className={cn('group absolute h-32 w-32 rounded-lg', {
												'bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100':
													!previewImage,
											})}
										>
											{previewImage ? (
												<div className="relative">
													<img
														src={previewImage}
														alt={altText ?? ''}
														className="h-32 w-32 rounded-lg object-cover"
													/>
												</div>
											) : (
												<div className="flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground">
													<Icon name="plus" />
												</div>
											)}
											<input
												aria-label="Image"
												className="absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0"
												onChange={event => {
													const file = event.target.files?.[0]

													if (file) {
														const reader = new FileReader()
														reader.onloadend = () => {
															setPreviewImage(reader.result as string)
														}
														reader.readAsDataURL(file)
													} else {
														setPreviewImage(null)
													}
												}}
												accept="image/*"
												{...conform.input(fields.file, {
													type: 'file',
													ariaAttributes: true,
												})}
											/>
										</label>
									</div>
									<div className="min-h-[32px] px-4 pb-3 pt-1">
										<ErrorList
											id={fields.file.errorId}
											errors={fields.file.errors}
										/>
									</div>
								</div>
								<TextareaField
									labelProps={{ children: 'Description' }}
									textareaProps={{
										...conform.textarea(fields.altText, {
											ariaAttributes: true,
										}),
									}}
									errors={fields.altText.errors}
								/>
							</div>
						</DialogFormsContainer>
					</fetcher.Form>
				</DialogContentGrid>
				<DialogFooter>
					<StatusButton
						form={form.id}
						type="submit"
						disabled={isPending}
						status={isPending ? 'pending' : 'idle'}
					>
						Submit
					</StatusButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
