import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint } from '@conform-to/zod'
import { type FetcherWithComponents } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { type z } from 'zod'
import {
	ImagePreview,
	ImagePreviewContainer,
	ImagePreviewLabel,
	ImagePreviewWrapper,
	ImageUploadInput,
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
import { type IconName } from '#app/components/ui/icon'
import { Label } from '#app/components/ui/label'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { StatusButton } from '#app/components/ui/status-button'
import { type IAssetParent } from '#app/models/asset/asset.server'
import { type IAssetImage } from '#app/models/asset/image/image.server'
import { type IAssetImageSrcStrategy } from '#app/strategies/asset.image.src.strategy'
import { useIsPending } from '#app/utils/misc'
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

	const lastSubmission = fetcher.data?.submission
	const isPending = useIsPending()
	const [form, fields] = useForm({
		id: formId,
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
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
							<Label>Images</Label>
							{images.map(image => {
								const { id, name, description, attributes } = image
								const { altText } = attributes
								const imgSrc = strategy.getAssetSrc({
									parentId: parent.id,
									assetId: id,
								})

								return (
									<FlexColumn key={image.id}>
										<ImagePreviewContainer>
											<ImagePreviewWrapper>
												<ImagePreviewLabel htmlFor={fields.file.id}>
													<div className="relative">
														<ImagePreview
															src={imgSrc}
															alt={altText ?? 'No alt text'}
														/>
													</div>
												</ImagePreviewLabel>
											</ImagePreviewWrapper>
										</ImagePreviewContainer>
										<ImageUploadInput
											className="hidden"
											disabled={true}
											aria-label="Image"
											accept="image/*"
											{...conform.input(fields.file, {
												type: 'file',
												ariaAttributes: true,
											})}
										/>
										<input type="hidden" name="name" value={name} />
										<input
											type="hidden"
											name="description"
											value={description ?? ''}
										/>
									</FlexColumn>
								)
							})}
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
