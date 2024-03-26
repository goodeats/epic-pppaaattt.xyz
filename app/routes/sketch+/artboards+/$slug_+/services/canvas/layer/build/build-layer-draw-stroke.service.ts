import { StrokeBasisTypeEnum } from '#app/schema/stroke'
import { colorRandomHex } from '#app/utils/colors'
import { randomIndex } from '#app/utils/random.utils'
import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawStrokeService = ({
	layer,
	pixelHex,
}: {
	layer: IArtboardLayerBuild
	pixelHex: string | null
}) => {
	const { stroke, palette } = layer
	const { basis, value } = stroke

	switch (basis) {
		case StrokeBasisTypeEnum.DEFINED:
			return value
		case StrokeBasisTypeEnum.RANDOM:
			return colorRandomHex()
		case StrokeBasisTypeEnum.PALETTE_SELECTED:
			return palette[0].value
		case StrokeBasisTypeEnum.PALETTE_RANDOM:
			const index = randomIndex(palette)
			return palette[index].value
		case StrokeBasisTypeEnum.PIXEL:
			// random to highlight something went wrong
			return pixelHex || colorRandomHex()
		default:
			return '000000'
	}
}
