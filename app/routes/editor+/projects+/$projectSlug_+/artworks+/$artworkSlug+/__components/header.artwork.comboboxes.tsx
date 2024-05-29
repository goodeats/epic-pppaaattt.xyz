import { memo } from 'react'
import { DashboardNav } from '#app/components/layout'
import { ComboboxNav } from '#app/components/templates/combobox'
import { TooltipIcon, TooltipIconLink } from '#app/components/templates/navbar'
import { type IArtworkWithBranchesAndVersions } from '#app/models/artwork/artwork.server'
import { type IArtworkBranchWithVersions } from '#app/models/artwork-branch/artwork-branch.server'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { type IProjectWithArtworks } from '#app/models/project/project.server'

export const NavComboboxes = memo(
	({
		project,
		artwork,
		branch,
		version,
		onLatestVersion,
	}: {
		project: IProjectWithArtworks
		artwork: IArtworkWithBranchesAndVersions
		branch: IArtworkBranchWithVersions
		version: IArtworkVersion
		onLatestVersion: boolean
	}) => {
		const baseUrl = `/editor/projects/${project.slug}/artworks`

		return (
			<DashboardNav className="sm:justify-start">
				<div className="flex flex-1 gap-4">
					<ComboboxNav
						entities={project.artworks}
						entitySingular="artwork"
						entityPlural="artworks"
						placeholder="Select an artwork..."
						slugParam="artworkSlug"
						baseUrl={baseUrl}
					/>
					<ComboboxNav
						entities={artwork.branches}
						entitySingular="branch"
						entityPlural="branches"
						placeholder={branch.name || 'Select a branch...'}
						slugParam="branchSlug"
						baseUrl={`${baseUrl}/${artwork.slug}`}
					/>
					{branch.description && (
						<TooltipIcon
							icon="info-circled"
							text="Branch Info"
							tooltipText={branch.description}
						/>
					)}
					<ComboboxNav
						entities={branch.versions}
						entitySingular="version"
						entityPlural="versions"
						placeholder={version.name || 'Select a version...'}
						slugParam="versionSlug"
						baseUrl={`${baseUrl}/${artwork.slug}/${branch.slug}`}
					/>
					<TooltipIcon
						icon="info-circled"
						text="Version Info"
						tooltipText={version.description}
					/>
					{!onLatestVersion && (
						// this should be displayed when:
						// - creating a new artwork version
						// - navigating to a previous artwork version
						<TooltipIconLink
							to="../latest"
							icon="pin-right"
							text="Latest"
							tooltipText="View the latest version of this artwork"
							buttonVariant="secondary"
						/>
					)}
				</div>
			</DashboardNav>
		)
	},
)
NavComboboxes.displayName = 'NavComboboxes'
