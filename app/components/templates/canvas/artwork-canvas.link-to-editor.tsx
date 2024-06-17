import { memo } from 'react'
import { PanelIconLink } from '#app/components/ui/panel-icon-link'
import { type IArtworkVersionGeneratorMetadata } from '#app/definitions/artwork-generator'
import { useOptionalUser } from '#app/utils/user'
import { TooltipHydrated } from '../tooltip'

export const LinkToEditor = memo(
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
