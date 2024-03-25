import { randomInRange } from '#app/utils/random.utils'
import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawPositionService = ({
	layer,
}: {
	layer: IArtboardLayerBuild
}) => {
	const { container } = layer
	const { width, height, top, left } = container

	// do margins later

	const x = randomInRange(left, width)
	const y = randomInRange(top, height)

	return { x, y }
}
