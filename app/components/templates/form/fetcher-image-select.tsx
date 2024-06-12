import { useForm, conform } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type FetcherWithComponents } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { type z } from 'zod'
import { ErrorList, Field, TextareaField } from '#app/components/forms'
import {
	ImagePreview,
	ImagePreviewContainer,
	ImagePreviewLabel,
	ImagePreviewSkeleton,
	ImagePreviewWrapper,
	ImageUploadInput,
	noImagePreviewClassName,
} from '#app/components/image'
import { FlexColumn } from '#app/components/layout'
import {
	DialogContentGrid,
	DialogFormsContainer,
} from '#app/components/layout/dialog'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '#app/components/ui/dialog'
import { Icon, type IconName } from '#app/components/ui/icon'
import { Label } from '#app/components/ui/label'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { StatusButton } from '#app/components/ui/status-button'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { useIsPending } from '#app/utils/misc'
import { TooltipHydrated } from '../tooltip'

export const FetcherImageSelect = ({
	fetcher,
	route,
	schema,
	formId,
	image,
	imgSrc,
	icon,
	iconText,
	tooltipText,
	dialogTitle,
	dialogDescription,
	isHydrated,
	children,
}: {
	fetcher: FetcherWithComponents<any>
	route: string
	schema: z.ZodSchema<any>
	formId: string
	image?: IAssetImage
	imgSrc?: string
	icon: IconName
	iconText: string
	tooltipText: string
	dialogTitle: string
	dialogDescription: string
	isHydrated: boolean
	children: JSX.Element
}) => {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState(image?.name ?? '')
	const [altText, setAltText] = useState(image?.attributes.altText ?? '')

	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	const [form, fields] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
		defaultValue: {
			id: image?.id ?? '',
			name,
			description: image?.description ?? '',
			altText,
		},
	})

	const [previewImage, setPreviewImage] = useState<string | null>(
		imgSrc ?? null,
	)

	// close after successful submission
	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data?.status === 'success') {
			setOpen(false)
		}
	}, [fetcher])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<TooltipHydrated tooltipText={tooltipText} isHydrated={isHydrated}>
				<DialogTrigger asChild>
					<PanelIconButton iconName={icon} iconText={iconText} />
				</DialogTrigger>
			</TooltipHydrated>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{dialogTitle}</DialogTitle>
					<DialogDescription>{dialogDescription}</DialogDescription>
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
						{children}

						<DialogFormsContainer>
							<Label>Image</Label>
							<FlexColumn>
								<ImagePreviewContainer>
									<ImagePreviewWrapper>
										<ImagePreviewLabel
											htmlFor={fields.file.id}
											className={!previewImage ? noImagePreviewClassName : ''}
										>
											{previewImage ? (
												<div className="relative">
													<ImagePreview
														src={previewImage}
														alt={altText ?? ''}
													/>
												</div>
											) : (
												<ImagePreviewSkeleton>
													<Icon name="plus" />
												</ImagePreviewSkeleton>
											)}
											<ImageUploadInput
												aria-label="Image"
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>,
												) => {
													const file = event.target.files?.[0]

													if (file) {
														const reader = new FileReader()
														reader.onloadend = () => {
															setPreviewImage(reader.result as string)
														}
														reader.readAsDataURL(file)
														setName(file.name)
													} else {
														setPreviewImage(null)
														setName('')
													}
												}}
												accept="image/*"
												{...conform.input(fields.file, {
													type: 'file',
													ariaAttributes: true,
												})}
											/>
										</ImagePreviewLabel>
									</ImagePreviewWrapper>
									<div className="min-h-[32px] px-4 pb-3 pt-1">
										<ErrorList
											id={fields.file.errorId}
											errors={fields.file.errors}
										/>
									</div>
								</ImagePreviewContainer>
								<Field
									labelProps={{ children: 'Name' }}
									inputProps={{
										autoFocus: true,
										...conform.input(fields.name, { ariaAttributes: true }),
										onChange: e => setName(e.currentTarget.value),
									}}
									errors={fields.name.errors}
								/>
								<TextareaField
									labelProps={{ children: 'Description' }}
									textareaProps={{
										...conform.textarea(fields.description, {
											ariaAttributes: true,
										}),
									}}
									errors={fields.description.errors}
								/>
								<TextareaField
									labelProps={{ children: 'Alt Text' }}
									textareaProps={{
										...conform.textarea(fields.altText, {
											ariaAttributes: true,
										}),
										onChange: e => setAltText(e.currentTarget.value),
									}}
									errors={fields.altText.errors}
								/>
							</FlexColumn>
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
