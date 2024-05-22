import { useMatches } from '@remix-run/react'
import { useCallback } from 'react'
import { DashboardHeader } from '#app/components/layout'
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
		<DashboardHeader id="dashboard-artwork-header">
			{navComboboxes()}
			{navActionsButtonGroup()}
		</DashboardHeader>
	)
}