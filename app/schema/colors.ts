import { z } from 'zod'
import { removeWhitespace } from '#app/utils/string-formatting'

const filterHexcodeChars = (input: string): string => {
	return input.replace(/[^0-9A-Fa-f]/g, '')
}

function validateStringIsHexcode(input: string): boolean {
	return /^#?[0-9A-Fa-f]{6}$/.test(input)
}

export const HexcodeSchema = z
	.string()
	.transform(val => val.toUpperCase())
	.transform(val => removeWhitespace(val))
	.transform(val => filterHexcodeChars(val))
	.refine(validateStringIsHexcode, {
		message: 'Must be a valid hexcode (0-9, A-F)',
	})
