import { MarketingCanvasGrid } from '#app/components/layout/marketing'
import { ArtworkCanvas } from '#app/components/templates/canvas'
import { type IArtworkVersionWithGenerator } from '#app/models/artwork-version/artwork-version.server'

export const CanvasGrid = ({
	versions,
}: {
	versions: IArtworkVersionWithGenerator[]
}) => {
	return (
		<MarketingCanvasGrid>
			{versions.map(version => {
				return <ArtworkCanvas key={version.id} generator={version.generator} />
			})}
		</MarketingCanvasGrid>
	)
}
