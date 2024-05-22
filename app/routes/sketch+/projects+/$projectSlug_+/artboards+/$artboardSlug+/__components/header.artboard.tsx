import { useMatches } from '@remix-run/react'
import { useCallback } from 'react'
import { DashboardHeader } from '#app/components/layout'
import { useRouteLoaderMatchData } from '#app/utils/matches'
import { artboardBranchLoaderRoute } from '../$branchSlug'
import { artboardVersionLoaderRoute } from '../$branchSlug.$versionSlug'
import { projectLoaderRoute } from '../../route'
import { artboardLoaderRoute } from '../route'
import { NavActionsButtonGroup } from './header.artboard.button-group'
import { NavComboboxes } from './header.artboard.comboboxes'

export const ArtboardHeader = () => {
	const matches = useMatches()
	const { project } = useRouteLoaderMatchData(matches, projectLoaderRoute)
	const { artboard } = useRouteLoaderMatchData(matches, artboardLoaderRoute)
	const { branch } = useRouteLoaderMatchData(matches, artboardBranchLoaderRoute)
	const { version } = useRouteLoaderMatchData(
		matches,
		artboardVersionLoaderRoute,
	)
	const onLatestVersion =
		version.slug === 'latest' || branch.versions[0].id === version.id

	const navComboboxes = useCallback(
		() => (
			<NavComboboxes
				project={project}
				artboard={artboard}
				branch={branch}
				version={version}
				onLatestVersion={onLatestVersion}
			/>
		),
		[project, artboard, branch, version, onLatestVersion],
	)

	const navActionsButtonGroup = useCallback(
		() => (
			<NavActionsButtonGroup
				artboard={artboard}
				branch={branch}
				version={version}
				onLatestVersion={onLatestVersion}
			/>
		),
		[artboard, branch, version, onLatestVersion],
	)

	return (
		<DashboardHeader id="dashboard-artboard-header">
			{navComboboxes()}
			{navActionsButtonGroup()}
		</DashboardHeader>
	)
}
