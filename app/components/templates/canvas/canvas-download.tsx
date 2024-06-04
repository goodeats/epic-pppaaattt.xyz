import { memo, useEffect, useState } from 'react'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { downloadCanvasToImg, downloadImageFileName } from '#app/utils/download'
import { TooltipHydrated } from '../tooltip'

export const DownloadCanvas = memo(
	({
		canvasRef,
		isHydrated,
	}: {
		canvasRef: React.RefObject<HTMLCanvasElement>
		isHydrated: boolean
	}) => {
		const [canDownload, setCanDownload] = useState(false)

		useEffect(() => {
			const checkShareCapability = () => {
				const canvas = canvasRef.current
				if (!canvas) return false

				canvas.toBlob(blob => {
					if (!blob) return
					const file = new File([blob], downloadImageFileName(), {
						type: 'image/png',
					})

					// if you can share then don't display download button
					const canShare =
						navigator.canShare && navigator.canShare({ files: [file] })
					setCanDownload(!canShare)
				}, 'image/png')
			}

			checkShareCapability()
		}, [canvasRef])

		const handleDownload = () => {
			const canvas = canvasRef.current

			if (!canvas) return
			downloadCanvasToImg({ canvas })
		}

		if (!canDownload) return null

		return (
			<TooltipHydrated tooltipText="Download" isHydrated={isHydrated}>
				<PanelIconButton
					iconName="download"
					iconText="Download"
					onClick={handleDownload}
				/>
			</TooltipHydrated>
		)
	},
)
DownloadCanvas.displayName = 'DownloadCanvas'
