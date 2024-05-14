import { useMatches } from '@remix-run/react'
import {
	DashboardHeader,
	DashboardNav,
	NavbarButtonGroup,
} from '#app/components/layout'
import { ComboboxNav } from '#app/components/templates/combobox'
import { TooltipIcon, TooltipIconLink } from '#app/components/templates/navbar'
import { ArtboardBranchCreate } from '#app/routes/resources+/api.v1+/artboard-branch.create'
import { ArtboardVersionCreate } from '#app/routes/resources+/api.v1+/artboard-version.create'
import { EntityParentIdType } from '#app/schema/entity'
import { useRouteLoaderMatchData } from '#app/utils/matches'
import { useUser } from '#app/utils/user'
import { artboardBranchLoaderRoute } from '../$branchSlug'
import { artboardVersionLoaderRoute } from '../$branchSlug.$versionSlug'
import { projectLoaderRoute } from '../../route'
import { artboardLoaderRoute } from '../route'

export const ArtboardHeader = () => {
	const user = useUser()
	const matches = useMatches()
	const { project } = useRouteLoaderMatchData(matches, projectLoaderRoute)
	const { artboard } = useRouteLoaderMatchData(matches, artboardLoaderRoute)
	const { branch } = useRouteLoaderMatchData(matches, artboardBranchLoaderRoute)
	const { version } = useRouteLoaderMatchData(
		matches,
		artboardVersionLoaderRoute,
	)
	const baseUrl = `/sketch/projects/${project.slug}/artboards`
	const onLatestVersion =
		version.slug === 'latest' || branch.versions[0].id === version.id

	return (
		<DashboardHeader id="dashboard-artboard-header">
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
		</DashboardHeader>
	)
}
