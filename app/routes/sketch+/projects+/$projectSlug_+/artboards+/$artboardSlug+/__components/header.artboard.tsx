import { Link, useMatches } from '@remix-run/react'
import {
	DashboardHeader,
	DashboardNav,
	NavbarButtonGroup,
} from '#app/components/layout'
import { ComboboxNav } from '#app/components/templates/combobox'
import { FormFetcherIcon } from '#app/components/templates/form/fetcher/icon'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { NewArtboardVersionSchema } from '#app/schema/artboard-version'
import { EntityParentIdType } from '#app/schema/entity'
import { useRouteLoaderMatchData } from '#app/utils/matches'
import { Routes } from '#app/utils/routes.utils'
import { artboardBranchLoaderRoute } from '../$branchSlug'
import { artboardVersionLoaderRoute } from '../$branchSlug.$versionSlug'
import { projectLoaderRoute } from '../../route'
import { artboardLoaderRoute } from '../route'

export const ArtboardHeader = () => {
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
					placeholder="Select a branch..."
					slugParam="branchSlug"
					baseUrl={`${baseUrl}/${artboard.slug}`}
				/>
				<ComboboxNav
					entities={branch.versions}
					entitySingular="version"
					entityPlural="versions"
					placeholder={version.name || 'Select a version...'}
					slugParam="versionSlug"
					baseUrl={`${baseUrl}/${artboard.slug}/${branch.slug}`}
				/>
				{!onLatestVersion && <LatestArtboardVersionLink />}
			</DashboardNav>
			<DashboardNav>
				<NavbarButtonGroup>
					{/* <span>refresh</span> */}
					{/* <span>star</span> */}
					{/* <span>info a, ab, abv</span> */}
					{/* <span>fork ab</span> */}
					{/* <span>merge ab</span> */}
					<FormFetcherIcon
						entityId={version.id}
						parentId={branch.id}
						parentTypeId={EntityParentIdType.ARTBOARD_BRANCH_ID}
						route={Routes.RESOURCES.API.V1.ARTBOARD_VERSION.CREATE}
						formId="artboard-version-create"
						schema={NewArtboardVersionSchema}
						icon="disc"
						iconText="New Version"
					/>
					<span>save av</span>
				</NavbarButtonGroup>
			</DashboardNav>
		</DashboardHeader>
	)
}

// this should be displayed when:
// - creating a new artboard version
// - navigating to a previous artboard version
const LatestArtboardVersionLink = () => {
	return (
		<Button asChild size="sm" variant="outline">
			<Link to="../latest" prefetch="intent">
				<Icon name="arrow-right" className="scale-125 max-md:scale-150">
					<span className="max-md:hidden">Latest</span>
				</Icon>
			</Link>
		</Button>
	)
}
