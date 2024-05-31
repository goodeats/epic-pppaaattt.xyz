import { useMatches } from '@remix-run/react'
import { useCallback } from 'react'
import { DashboardNav, FlexRow } from '#app/components/layout'
import { SidebarMobile } from '#app/components/templates'
import { useRouteLoaderMatchData } from '#app/utils/matches'
import { artworkBranchLoaderRoute } from '../$branchSlug'
import { artworkVersionLoaderRoute } from '../$branchSlug.$versionSlug'
import { projectLoaderRoute } from '../../route'
import { artworkLoaderRoute } from '../route'
import { NavActionsButtonGroup } from './header.artwork.button-group'
import { NavComboboxes } from './header.artwork.comboboxes'

export const ArtworkHeader = () => {
	const matches = useMatches()
	const { project } = useRouteLoaderMatchData(matches, projectLoaderRoute)
	const { artwork } = useRouteLoaderMatchData(matches, artworkLoaderRoute)
	const { branch } = useRouteLoaderMatchData(matches, artworkBranchLoaderRoute)
	const { version } = useRouteLoaderMatchData(
		matches,
		artworkVersionLoaderRoute,
	)
	const onLatestVersion =
		version.slug === 'latest' || branch.versions[0].id === version.id

	const navComboboxes = useCallback(
		() => (
			<NavComboboxes
				project={project}
				artwork={artwork}
				branch={branch}
				version={version}
				onLatestVersion={onLatestVersion}
			/>
		),
		[project, artwork, branch, version, onLatestVersion],
	)

	const navActionsButtonGroup = useCallback(
		() => (
			<NavActionsButtonGroup
				artwork={artwork}
				branch={branch}
				version={version}
				onLatestVersion={onLatestVersion}
			/>
		),
		[artwork, branch, version, onLatestVersion],
	)

	return (
		<FlexRow className="justify-between">
			<DashboardNav className="sm:justify-start">
				<div className="hidden md:flex">{navComboboxes()}</div>
				<div className="flex md:hidden">
					<SidebarMobile>
						<div>
							<h1>Editor Options:</h1>
							{navComboboxes()}
						</div>
					</SidebarMobile>
				</div>
			</DashboardNav>
			<DashboardNav>{navActionsButtonGroup()}</DashboardNav>
		</FlexRow>
	)
}
