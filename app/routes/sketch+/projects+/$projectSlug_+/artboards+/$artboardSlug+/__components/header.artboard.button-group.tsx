import { memo } from 'react'
import { DashboardNav, NavbarButtonGroup } from '#app/components/layout'
import { TooltipIconLink } from '#app/components/templates/navbar'
import { type IArtboard } from '#app/models/artboard/artboard.server'
import { type IArtboardBranch } from '#app/models/artboard-branch/artboard-branch.server'
import { type IArtboardVersion } from '#app/models/artboard-version/artboard-version.server'
import { ArtboardBranchCreate } from '#app/routes/resources+/api.v1+/artboard-branch.create'
import { ArtboardVersionCreate } from '#app/routes/resources+/api.v1+/artboard-version.create'
import { EntityParentIdType } from '#app/schema/entity'
import { useUser } from '#app/utils/user'

export const NavActionsButtonGroup = memo(
	({
		artboard,
		branch,
		version,
		onLatestVersion,
	}: {
		artboard: IArtboard
		branch: IArtboardBranch
		version: IArtboardVersion
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
					<ArtboardBranchCreate
						branchId={branch.id}
						artboardId={artboard.id}
						versionId={version.id}
						formId="artboard-branch-create"
					/>
					<ArtboardVersionCreate
						entityId={version.id}
						parentId={branch.id}
						parentTypeId={EntityParentIdType.ARTBOARD_BRANCH_ID}
						formId="artboard-version-create"
						onOlderVersion={!onLatestVersion}
					/>
					<TooltipIconLink
						to={`/users/${user.username}/artboards/${artboard.slug}`}
						icon="pencil-1"
						text="Latest"
						tooltipText="View the artboard details"
						buttonVariant="ghost"
					/>
				</NavbarButtonGroup>
			</DashboardNav>
		)
	},
)
NavActionsButtonGroup.displayName = 'NavActionsButtonGroup'
