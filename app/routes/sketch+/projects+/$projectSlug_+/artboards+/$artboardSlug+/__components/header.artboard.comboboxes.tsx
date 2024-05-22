import { memo } from 'react'
import { DashboardNav } from '#app/components/layout'
import { ComboboxNav } from '#app/components/templates/combobox'
import { TooltipIcon, TooltipIconLink } from '#app/components/templates/navbar'
import { type IArtboardWithBranchesAndVersions } from '#app/models/artboard/artboard.server'
import { type IArtboardBranchWithVersions } from '#app/models/artboard-branch/artboard-branch.server'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { type IProjectWithArtboards } from '#app/models/project/project.server'

export const NavComboboxes = memo(
	({
		project,
		artboard,
		branch,
		version,
		onLatestVersion,
	}: {
		project: IProjectWithArtboards
		artboard: IArtboardWithBranchesAndVersions
		branch: IArtboardBranchWithVersions
		version: IArtboardVersion
		onLatestVersion: boolean
	}) => {
		const baseUrl = `/sketch/projects/${project.slug}/artboards`

		return (
			<DashboardNav className="sm:justify-start">
				<ComboboxNav
					entities={project.artboards}
					entitySingular="artboard"
					entityPlural="artboards"
					placeholder="Select an artboard..."
					slugParam="artboardSlug"
					baseUrl={baseUrl}
				/>
				<ComboboxNav
					entities={artboard.branches}
					entitySingular="branch"
					entityPlural="branches"
					placeholder={branch.name || 'Select a branch...'}
					slugParam="branchSlug"
					baseUrl={`${baseUrl}/${artboard.slug}`}
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
					baseUrl={`${baseUrl}/${artboard.slug}/${branch.slug}`}
				/>
				<TooltipIcon
					icon="info-circled"
					text="Version Info"
					tooltipText={version.description}
				/>
				{!onLatestVersion && (
					// this should be displayed when:
					// - creating a new artboard version
					// - navigating to a previous artboard version
					<TooltipIconLink
						to="../latest"
						icon="pin-right"
						text="Latest"
						tooltipText="View the latest version of this artboard"
						buttonVariant="secondary"
					/>
				)}
			</DashboardNav>
		)
	},
)
NavComboboxes.displayName = 'NavComboboxes'
