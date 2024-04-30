import { useMatches } from '@remix-run/react'
import { DashboardHeader, DashboardNav } from '#app/components/layout'
import { ComboboxNav } from '#app/components/templates/combobox'
import { useRouteLoaderMatchData } from '#app/utils/matches'
import { artboardBranchLoaderRoute } from '../$branchSlug'
import { projectLoaderRoute } from '../../route'
import { artboardLoaderRoute } from '../route'

export const ArtboardHeader = () => {
	const matches = useMatches()
	const { project } = useRouteLoaderMatchData(matches, projectLoaderRoute)
	const { artboard } = useRouteLoaderMatchData(matches, artboardLoaderRoute)
	const { branch } = useRouteLoaderMatchData(matches, artboardBranchLoaderRoute)

	const baseUrl = `/sketch/projects/${project.slug}/artboards`

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
					placeholder="Select a branch..."
					slugParam="branchSlug"
					baseUrl={`${baseUrl}/${artboard.slug}`}
				/>
				<ComboboxNav
					entities={branch.versions}
					entitySingular="version"
					entityPlural="versions"
					placeholder="Select a version..."
					slugParam="versionSlug"
					baseUrl={`${baseUrl}/${artboard.slug}/${branch.slug}`}
				/>
			</DashboardNav>
			<DashboardNav>
				<p>nav actions</p>
			</DashboardNav>
		</DashboardHeader>
	)
}
