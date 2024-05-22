import { type ILayerGenerator } from '#app/definitions/artwork-generator'
import { FillBasisTypeEnum, FillStyleTypeEnum } from '#app/schema/fill'
import {
	getCircularItemInArray,
	getRandomItemInArray,
	getReverseCircularItemInArray,
} from '#app/utils/array.utils'
import { colorRandomHex } from '#app/utils/colors'

export const canvasBuildLayerDrawFillService = ({
	layer,
	index,
	pixelHex,
}: {
	layer: ILayerGenerator
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
			return getRandomItemInArray(palette).value
		case FillBasisTypeEnum.PALETTE_LOOP:
			return getCircularItemInArray(palette, index).value
		case FillBasisTypeEnum.PALETTE_LOOP_REVERSE:
			return getReverseCircularItemInArray(palette, index).value
		case FillBasisTypeEnum.PIXEL:
			// random to highlight something went wrong
			return pixelHex || colorRandomHex()
		default:
			return '000000'
	}
}
