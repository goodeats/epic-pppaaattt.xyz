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
		// const [fileToShare, setFileToShare] = useState<File | null>(null)

		useEffect(() => {
			const checkShareCapability = () => {
				const canvas = canvasRef.current
				if (!canvas) return false

				canvas.toBlob(blob => {
					if (!blob) return
					const file = new File([blob], downloadImageFileName(), {
						type: 'image/png',
					})

					if (navigator.canShare && navigator.canShare({ files: [file] })) {
						setCanShare(true)
						// setFileToShare(file)
					} else {
						setCanShare(false)
					}
				}, 'image/png')
			}

			const canvas = canvasRef.current
			if (!canvas) return

			checkShareCapability()
		}, [canvasRef])

		const handleShare = async () => {
			// if (!fileToShare) return

			// navigator
			// 	.share({
			// 		files: [fileToShare],
			// 		title: 'Share this artwork from PPPAAATTTT',
			// 	})
			// 	.catch(error => console.error('Error sharing', error))

			// quick and dirty hack before meetup
			// https://github.com/benkaiser/web-share-images/blob/master/src/examples/WebShareCanvas.tsx
			const dataUrl = canvasRef.current!.toDataURL()
			const blob = await (await fetch(dataUrl)).blob()
			const filesArray: File[] = [
				new File([blob], downloadImageFileName(), {
					type: 'image/png',
					lastModified: new Date().getTime(),
				}),
			]
			const shareData = {
				files: filesArray,
			}
			navigator.share(shareData as any).then(() => {
				console.log('Shared successfully')
			})
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
