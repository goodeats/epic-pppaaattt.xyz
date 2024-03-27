import { StrokeBasisTypeEnum } from '#app/schema/stroke'
import { colorRandomHex } from '#app/utils/colors'
import { randomIndex } from '#app/utils/random.utils'
import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawStrokeService = ({
	layer,
	index,
	pixelHex,
}: {
	layer: IArtboardLayerBuild
	index: number
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
			const paletteRandomIndex = randomIndex(palette)
			return palette[paletteRandomIndex].value
		case StrokeBasisTypeEnum.PALETTE_LOOP:
			const paletteLoopIndex = index % palette.length
			return palette[paletteLoopIndex].value
		case StrokeBasisTypeEnum.PIXEL:
			// random to highlight something went wrong
			return pixelHex || colorRandomHex()
		default:
			return '000000'
	}
}
