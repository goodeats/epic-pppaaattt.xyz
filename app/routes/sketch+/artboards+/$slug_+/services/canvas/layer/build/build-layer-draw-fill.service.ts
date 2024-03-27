import { FillBasisTypeEnum, FillStyleTypeEnum } from '#app/schema/fill'
import { colorRandomHex } from '#app/utils/colors'
import { randomIndex } from '#app/utils/random.utils'
import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawFillService = ({
	layer,
	index,
	pixelHex,
}: {
	layer: IArtboardLayerBuild
	index: number
	pixelHex: string | null
}) => {
	const { fill, palette } = layer
	const { style, basis, value } = fill

	if (style === FillStyleTypeEnum.NONE) return 'none'

	switch (basis) {
		case FillBasisTypeEnum.DEFINED:
			return value
		case FillBasisTypeEnum.RANDOM:
			return colorRandomHex()
		case FillBasisTypeEnum.PALETTE_SELECTED:
			return palette[0].value
		case FillBasisTypeEnum.PALETTE_RANDOM:
			const paletteRandomIndex = randomIndex(palette)
			return palette[paletteRandomIndex].value
		case FillBasisTypeEnum.PALETTE_LOOP:
			const paletteLoopIndex = index % palette.length
			return palette[paletteLoopIndex].value
		case FillBasisTypeEnum.PIXEL:
			// random to highlight something went wrong
			return pixelHex || colorRandomHex()
		default:
			return '000000'
	}
}
