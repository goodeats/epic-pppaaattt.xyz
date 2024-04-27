import { invariant } from '@epic-web/invariant'
import { type SerializeFrom } from '@remix-run/node'
import { type UIMatch } from '@remix-run/react'
import { type MetaMatches } from '@remix-run/react/dist/routeModules'
import { type loader as rootLoader } from '#app/root.tsx'
import {
	type artboardstLoaderRoute,
	type loader as artboardsLoader,
} from '#app/routes/sketch+/projects+/$projectSlug_+/artboards+'
import {
	type artboardBranchLoaderRoute,
	type loader as artboardBranchLoader,
} from '#app/routes/sketch+/projects+/$projectSlug_+/artboards+/$artboardSlug+/$branchSlug'
import {
	type artboardVersionLoaderRoute,
	type loader as artboardVersionLoader,
} from '#app/routes/sketch+/projects+/$projectSlug_+/artboards+/$artboardSlug+/$branchSlug.$versionSlug'
import {
	type artboardLoaderRoute,
	type loader as artboardLoader,
} from '#app/routes/sketch+/projects+/$projectSlug_+/artboards+/$artboardSlug+/route'
import {
	type projectLoaderRoute,
	type loader as projectLoader,
} from '#app/routes/sketch+/projects+/$projectSlug_+/route'
import {
	type projectsLoaderRoute,
	type loader as projectsLoader,
} from '#app/routes/sketch+/projects+/route'

// ensure matches route loader data is available for meta
// https://github.com/remix-run/remix/issues/7347 -- so good
// eventually these route loaders should reference they are in the sketch+ route
interface RouteLoaders {
	root: typeof rootLoader
	[projectsLoaderRoute]: typeof projectsLoader
	[projectLoaderRoute]: typeof projectLoader
	[artboardstLoaderRoute]: typeof artboardsLoader
	[artboardLoaderRoute]: typeof artboardLoader
	[artboardBranchLoaderRoute]: typeof artboardBranchLoader
	[artboardVersionLoaderRoute]: typeof artboardVersionLoader
}

export function routeLoaderMetaData<K extends keyof RouteLoaders>(
	matches: MetaMatches,
	matchId: K,
): SerializeFrom<RouteLoaders[K]> {
	const match = matches.find(({ id }) => id === matchId)
	invariant(match, `Router loader data not found for meta: ${matchId}`)
	return match.data as SerializeFrom<RouteLoaders[K]>
}

export function useOptionalRouteLoaderMatchData<K extends keyof RouteLoaders>(
	matches: UIMatch[],
	matchId: K,
): SerializeFrom<RouteLoaders[K]> | undefined {
	const match = matches.find(({ id }) => id === matchId)
	if (!match) return undefined
	return match.data as SerializeFrom<RouteLoaders[K]>
}

export function useRouteLoaderMatchData<K extends keyof RouteLoaders>(
	matches: UIMatch[],
	matchId: K,
): SerializeFrom<RouteLoaders[K]> {
	const match = matches.find(({ id }) => id === matchId)
	invariant(match, `Router loader data not found for match: ${matchId}`)
	return match.data as SerializeFrom<RouteLoaders[K]>
}
