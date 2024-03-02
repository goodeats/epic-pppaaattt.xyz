import { z } from 'zod'
import { filterHexcodeChars, validateStringIsHexcode } from '#app/utils/colors'
import { removeWhitespace } from '#app/utils/string-formatting'

export const HexcodeSchema = z
	.string()
	.transform(val => val.toUpperCase())
	.transform(val => removeWhitespace(val))
	.transform(val => filterHexcodeChars(val))
	.refine(validateStringIsHexcode, {
		message: 'Value must be valid hexcode',
	})
