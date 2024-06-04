import { memo, useEffect, useState } from 'react'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { downloadImageFileName } from '#app/utils/download'
import { TooltipHydrated } from '../tooltip'

export const ShareCanvas = memo(
	({
		canvasRef,
		isHydrated,
	}: {
		canvasRef: React.RefObject<HTMLCanvasElement>
		isHydrated: boolean
	}) => {
		const [canShare, setCanShare] = useState(false)
		const [fileToShare, setFileToShare] = useState<File | null>(null)

		useEffect(() => {
			const checkShareCapability = () => {
				const canvas = canvasRef.current
				if (!canvas) return false

				const ctx = canvas.getContext('2d')
				if (!ctx) return false

				// Check if the canvas is not blank
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
				const isNotBlank = imageData.data.some(value => value !== 0)

				if (isNotBlank) {
					canvas.toBlob(blob => {
						if (!blob) return
						const file = new File([blob], downloadImageFileName(), {
							type: 'image/png',
						})

						if (navigator.canShare && navigator.canShare({ files: [file] })) {
							setCanShare(true)
							setFileToShare(file)
						} else {
							setCanShare(false)
						}
					}, 'image/png')
				} else {
					// Canvas is blank, retry after a short delay
					setTimeout(checkShareCapability, 100)
				}
			}

			const canvas = canvasRef.current
			if (!canvas) return

			const handleCanvasLoad = () => {
				checkShareCapability()
			}

			canvas.addEventListener('load', handleCanvasLoad)
			return () => {
				canvas.removeEventListener('load', handleCanvasLoad)
			}
		}, [canvasRef])

		const handleShare = () => {
			if (!fileToShare) return

			navigator
				.share({
					files: [fileToShare],
					title: 'Share this artwork from PPPAAATTTT',
				})
				.catch(error => console.error('Error sharing', error))
		}

		if (!canShare) return null

		return (
			<TooltipHydrated tooltipText="Share" isHydrated={isHydrated}>
				<PanelIconButton
					iconName="share-2"
					iconText="Share"
					onClick={handleShare}
				/>
			</TooltipHydrated>
		)
	},
)
ShareCanvas.displayName = 'ShareCanvas'
