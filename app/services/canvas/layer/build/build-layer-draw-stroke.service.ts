import { type ILayerGenerator } from '#app/definitions/artwork-generator'
import { StrokeBasisTypeEnum } from '#app/schema/stroke'
import {
	getCircularItemInArray,
	getRandomItemInArray,
	getReverseCircularItemInArray,
} from '#app/utils/array.utils'
import { colorRandomHex } from '#app/utils/colors'

export const canvasBuildLayerDrawStrokeService = ({
	layer,
	index,
	pixelHex,
}: {
	layer: ILayerGenerator
	index: number
	pixelHex: string | null
}) => {
	const { stroke, palette } = layer
	const { basis, value } = stroke.attributes

	switch (basis) {
		case StrokeBasisTypeEnum.DEFINED:
			return value
		case StrokeBasisTypeEnum.RANDOM:
			return colorRandomHex()
		case StrokeBasisTypeEnum.PALETTE_SELECTED:
			return palette[0].attributes.value
		case StrokeBasisTypeEnum.PALETTE_RANDOM:
			return getRandomItemInArray(palette).attributes.value
		case StrokeBasisTypeEnum.PALETTE_LOOP:
			return getCircularItemInArray(palette, index).attributes.value
		case StrokeBasisTypeEnum.PALETTE_LOOP_REVERSE:
			return getReverseCircularItemInArray(palette, index).attributes.value
		case StrokeBasisTypeEnum.PIXEL:
			// random to highlight something went wrong
			return pixelHex || colorRandomHex()
		default:
			return '000000'
	}
}
