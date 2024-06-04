import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { FlexColumn, FlexRow } from '#app/components/layout'
import { PanelIconButton } from '#app/components/ui/panel-icon-button'
import { PanelIconLink } from '#app/components/ui/panel-icon-link'
import {
	type IArtworkVersionGeneratorMetadata,
	type IArtworkVersionGenerator,
} from '#app/definitions/artwork-generator'
import { canvasDrawService } from '#app/services/canvas/draw.service'
import { useOptionalUser } from '#app/utils/user'
import { TooltipHydrated } from '../tooltip'
import { DownloadCanvas, ShareCanvas } from '.'

const LinkToEditor = memo(
	({
		metadata,
		isHydrated,
	}: {
		metadata: IArtworkVersionGeneratorMetadata
		isHydrated: boolean
	}) => {
		const { projectSlug, artworkSlug, branchSlug, versionSlug, ownerId } =
			metadata
		const user = useOptionalUser()
		const isOwner = user?.id === ownerId
		if (!isOwner) return null

		const editorPath = `/editor/projects/${projectSlug}/artworks/${artworkSlug}/${branchSlug}/${versionSlug}`
		return (
			<div className="ml-auto">
				<TooltipHydrated tooltipText="Editor" isHydrated={isHydrated}>
					<PanelIconLink
						to={editorPath}
						iconName="magic-wand"
						iconText="Editor"
					/>
				</TooltipHydrated>
			</div>
		)
	},
)
LinkToEditor.displayName = 'LinkToEditor'

// The ArtworkCanvas component is wrapped in React.memo to optimize performance by memoizing the component.
// This prevents unnecessary re-renders when the props passed to the component have not changed.
// Specifically, since this component involves canvas drawing operations which can be computationally expensive,
// memoizing ensures that these operations are only re-executed when necessary, such as when the 'generator' prop changes.
export const ArtworkCanvas = memo(
	({ generator }: { generator: IArtworkVersionGenerator }) => {
		const { metadata, settings } = generator
		const { width, height, background } = settings
		const canvasRef = useRef<HTMLCanvasElement>(null)
		const [refresh, setRefresh] = useState(0)
		let isHydrated = useHydrated()

		useEffect(() => {
			const canvas = canvasRef.current
			if (canvas) {
				canvasDrawService({ canvas, generator })
			}
		}, [canvasRef, generator, refresh])

		const linkToEditor = useCallback(
			() =>
				metadata ? (
					<LinkToEditor metadata={metadata} isHydrated={isHydrated} />
				) : null,
			[metadata, isHydrated],
		)

		const handleRefresh = () => {
			setRefresh(prev => prev + 1)
		}

		return (
			<FlexColumn className="gap-2">
				<canvas
					id="canvas-editor"
					ref={canvasRef}
					width={width}
					height={height}
					style={{ backgroundColor: `#${background}` }}
					className="h-full w-full"
				/>
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
					{generator.metadata && linkToEditor()}
				</FlexRow>
			</FlexColumn>
		)
	},
)
ArtworkCanvas.displayName = 'ArtworkCanvas'
