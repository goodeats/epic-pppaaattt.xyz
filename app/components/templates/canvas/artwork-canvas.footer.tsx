import { memo, useCallback } from 'react'
import { FlexRow } from '#app/components/layout'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { type IArtworkVersionGenerator } from '#app/definitions/artwork-generator'
import { TooltipHydrated } from '../tooltip'
import { LinkToEditor } from './artwork-canvas.link-to-editor'
import { DownloadCanvas, ShareCanvas } from '.'

interface CanvasFooterProps {
	isHydrated: boolean
	handleRefresh: () => void
	canvasRef: React.RefObject<HTMLCanvasElement>
	generator: IArtworkVersionGenerator
}

export const CanvasFooter = memo(
	({ isHydrated, handleRefresh, canvasRef, generator }: CanvasFooterProps) => {
		const { metadata } = generator

		const linkToEditor = useCallback(
			() =>
				metadata ? (
					<LinkToEditor metadata={metadata} isHydrated={isHydrated} />
				) : null,
			[metadata, isHydrated],
		)

		return (
			<FlexRow className="gap-2">
				<TooltipHydrated tooltipText="Reload" isHydrated={isHydrated}>
					<PanelIconButton
						iconName="reload"
						iconText="Reload"
						onClick={handleRefresh}
					/>
				</TooltipHydrated>
				<DownloadCanvas canvasRef={canvasRef} isHydrated={isHydrated} />
				<ShareCanvas canvasRef={canvasRef} isHydrated={isHydrated} />
				{linkToEditor()}
			</FlexRow>
		)
	},
)
CanvasFooter.displayName = 'CanvasFooter'
