import { invariant } from '@epic-web/invariant'
import { type SerializeFrom } from '@remix-run/node'
import { type UIMatch } from '@remix-run/react'
import { type MetaMatches } from '@remix-run/react/dist/routeModules'
import { type loader as rootLoader } from '#app/root.tsx'
import {
	type artworkstLoaderRoute,
	type loader as artworksLoader,
} from '#app/routes/editor+/projects+/$projectSlug_+/artworks+'
import {
	type artworkBranchLoaderRoute,
	type loader as artworkBranchLoader,
} from '#app/routes/editor+/projects+/$projectSlug_+/artworks+/$artworkSlug+/$branchSlug'
import {
	type artworkVersionLoaderRoute,
	type loader as artworkVersionLoader,
} from '#app/routes/editor+/projects+/$projectSlug_+/artworks+/$artworkSlug+/$branchSlug.$versionSlug'
import {
	type artworkLoaderRoute,
	type loader as artworkLoader,
} from '#app/routes/editor+/projects+/$projectSlug_+/artworks+/$artworkSlug+/route'
import {
	type projectLoaderRoute,
	type loader as projectLoader,
} from '#app/routes/editor+/projects+/$projectSlug_+/route'
import {
	type projectsLoaderRoute,
	type loader as projectsLoader,
} from '#app/routes/editor+/projects+/route'
import {
	type editorLoaderRoute,
	type loader as editorLoader,
} from '#app/routes/editor+/route'

// ensure matches route loader data is available for meta
// https://github.com/remix-run/remix/issues/7347 -- so good
// eventually these route loaders should reference they are in the editor+ route
interface RouteLoaders {
	root: typeof rootLoader
	[editorLoaderRoute]: typeof editorLoader
	[projectsLoaderRoute]: typeof projectsLoader
	[projectLoaderRoute]: typeof projectLoader
	[artworkstLoaderRoute]: typeof artworksLoader
	[artworkLoaderRoute]: typeof artworkLoader
	[artworkBranchLoaderRoute]: typeof artworkBranchLoader
	[artworkVersionLoaderRoute]: typeof artworkVersionLoader
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
