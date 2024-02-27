import { z } from 'zod'
import {
	capitalize,
	removeWhitespace,
	trimSpacesInBetween,
} from './string-formatting'

export const HexcodeStringSchema = (name: string) => {
	return z
		.string()
		.transform(val => removeWhitespace(val))
		.transform(val => capitalize(val))
		.transform(val => trimSpacesInBetween(val))
		.transform(val => formatSringsToHex(val.split(',')))
		.refine(validateStringsAreHexcodes, {
			message: 'Values must be valid hexcodes',
		})
}

export const stringToHexcode = z
	.string()
	.transform(val => val.toUpperCase())
	.transform(val => removeWhitespace(val))
	.transform(val => filterHexcodeChars(val))

export const filterHexcodeChars = (input: string): string => {
	return input.replace(/[^0-9A-Fa-f]/g, '')
}

export function formatSringsToHex(input: string[]): string[] {
	return input.map(value => {
		return value.startsWith('#') ? value : `#${value}`
	})
}

export function validateStringsAreHexcodes(input: string[]): boolean {
	return input.every(value => /^#?[0-9A-Fa-f]{6}$/.test(value))
}

export function validateStringIsHexcode(input: string): boolean {
	return /^#?[0-9A-Fa-f]{6}$/.test(input)
}
