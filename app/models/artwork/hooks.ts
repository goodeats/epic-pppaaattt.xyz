import { useMatches } from '@remix-run/react'
import { artworkVersionLoaderRoute } from '#app/routes/editor+/projects+/$projectSlug_+/artworks+/$artworkSlug+/$branchSlug.$versionSlug'
import { useRouteLoaderMatchData } from '#app/utils/matches'
import { type IArtworkWithAssets } from './artwork.server'

export function useArtworkFromVersion(): IArtworkWithAssets {
	const matches = useMatches()
	const { artwork } = useRouteLoaderMatchData(
		matches,
		artworkVersionLoaderRoute, // support other route loaders when necessary
	)
	return artwork as IArtworkWithAssets
}
