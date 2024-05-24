import { memo } from 'react'
import { DashboardNav, NavbarButtonGroup } from '#app/components/layout'
import { TooltipIconLink } from '#app/components/templates/navbar'
import { type IArtwork } from '#app/models/artwork/artwork.server'
import { type IArtworkBranch } from '#app/models/artwork-branch/artwork-branch.server'
import { type IArtworkVersion } from '#app/models/artwork-version/artwork-version.server'
import { ArtworkBranchCreate } from '#app/routes/resources+/api.v1+/artwork-branch.create'
import { ArtworkVersionCreate } from '#app/routes/resources+/api.v1+/artwork-version.create'
import { ArtworkVersionToggleStarred } from '#app/routes/resources+/api.v1+/artwork-version.update.starred'
import { EntityParentIdType } from '#app/schema/entity'
import { useUser } from '#app/utils/user'

export const NavActionsButtonGroup = memo(
	({
		artwork,
		branch,
		version,
		onLatestVersion,
	}: {
		artwork: IArtwork
		branch: IArtworkBranch
		version: IArtworkVersion
		onLatestVersion: boolean
	}) => {
		const user = useUser()

		return (
			<DashboardNav>
				{/* TODO: make these have the same look as the form fetcher icon */}
				<NavbarButtonGroup>
					{/* <span>refresh</span> */}
					{/* <span>star</span> */}
					{/* <span>info a, ab, abv</span> */}
					{/* <span>fork ab</span> */}
					{/* <span>merge ab</span> */}
					<ArtworkVersionToggleStarred version={version} />
					<ArtworkBranchCreate
						branchId={branch.id}
						artworkId={artwork.id}
						versionId={version.id}
						formId="artwork-branch-create"
					/>
					<ArtworkVersionCreate
						entityId={version.id}
						parentId={branch.id}
						parentTypeId={EntityParentIdType.ARTWORK_BRANCH_ID}
						formId="artwork-version-create"
						onOlderVersion={!onLatestVersion}
					/>
					<TooltipIconLink
						to={`/users/${user.username}/artworks/${artwork.slug}`}
						icon="pencil-1"
						text="Latest"
						tooltipText="View the artwork details"
						buttonVariant="ghost"
					/>
				</NavbarButtonGroup>
			</DashboardNav>
		)
	},
)
NavActionsButtonGroup.displayName = 'NavActionsButtonGroup'
