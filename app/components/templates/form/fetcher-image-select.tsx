import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type FetcherWithComponents } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { type z } from 'zod'
import {
	ImagePreview,
	ImagePreviewContainer,
	ImagePreviewLabel,
	ImagePreviewWrapper,
} from '#app/components/image'
import { FlexColumn, FlexRow } from '#app/components/layout'
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
import { type IconName } from '#app/components/ui/icon'
import { Input } from '#app/components/ui/input'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { StatusButton } from '#app/components/ui/status-button'
import { type IAssetParent } from '#app/models/asset/asset.server'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { sizeInMB } from '#app/models/asset/image/utils'
import { type IAssetImageSrcStrategy } from '#app/strategies/asset.image.src.strategy'
import { cn, useIsPending } from '#app/utils/misc'
import { TooltipHydrated } from '../tooltip'

export const FetcherImageSelect = ({
	fetcher,
	route,
	schema,
	formId,
	images,
	parent,
	strategy,
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
	images: IAssetImage[]
	parent: IAssetParent
	strategy: IAssetImageSrcStrategy
	icon: IconName
	iconText: string
	tooltipText: string
	dialogTitle: string
	dialogDescription: string
	isHydrated: boolean
	children: JSX.Element
}) => {
	const [open, setOpen] = useState(false)
	const [selectedImageId, setSelectedImageId] = useState<
		IAssetImage['id'] | null
	>(null)

	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	const [form, { assetImageId }] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
		shouldValidate: 'onInput',
		onValidate({ formData }) {
			const parsed = parse(formData, { schema })
			setSelectedImageId(
				(parsed.payload.assetImageId as IAssetImage['id']) ?? null,
			)
			return parsed
		},
		onSubmit: async (event, { formData }) => {
			event.preventDefault()
			fetcher.submit(formData, {
				method: 'POST',
				action: route,
			})
		},
	})

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
							<fieldset>
								<FlexColumn className="gap-4">
									{conform
										.collection(assetImageId, {
											type: 'radio',
											options: images.map(image => image.id),
										})
										.map((props, index) => {
											const image = images.find(
												image => image.id === props.value,
											) as IAssetImage
											const isSelectedImage = selectedImageId === image.id

											const { id, name, attributes } = image
											const { altText, height, width, size } = attributes
											const imgSrc = strategy.getAssetSrc({
												parentId: parent.id,
												assetId: id,
											})

											return (
												<FlexRow
													key={index}
													className={cn(
														'flex-1 gap-4 p-4',
														isSelectedImage
															? 'rounded-lg border border-secondary-foreground bg-secondary'
															: '',
													)}
												>
													<ImagePreviewContainer>
														<ImagePreviewWrapper>
															<ImagePreviewLabel htmlFor={props.id}>
																<div className="relative">
																	<div>
																		<ImagePreview
																			src={imgSrc}
																			alt={altText ?? 'No alt text'}
																		/>
																	</div>
																</div>
																<Input
																	id={props.id}
																	{...props}
																	className="hidden"
																/>
															</ImagePreviewLabel>
														</ImagePreviewWrapper>
													</ImagePreviewContainer>
													<FlexRow className="flex-1 items-end">
														<FlexColumn className="h-full flex-1 items-center justify-between">
															<FlexColumn className="self-end">
																<FlexRow className="justify-end">
																	{name}
																</FlexRow>
																<FlexRow className="justify-end">
																	{width}x{height}
																</FlexRow>
																<FlexRow className="justify-end">
																	<div>{sizeInMB(size)} MB</div>
																</FlexRow>
															</FlexColumn>
														</FlexColumn>
													</FlexRow>
												</FlexRow>
											)
										})}
								</FlexColumn>
							</fieldset>
						</DialogFormsContainer>
					</fetcher.Form>
				</DialogContentGrid>
				<DialogFooter>
					<StatusButton
						form={form.id}
						type="submit"
						name="intent"
						value="clone"
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
