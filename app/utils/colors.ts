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

export function formatSringsToHex(input: string[]): string[] {
	return input.map(value => {
		return value.startsWith('#') ? value : `#${value}`
	})
}

export function validateStringsAreHexcodes(input: string[]): boolean {
	return input.every(value => /^#?[0-9A-Fa-f]{6}$/.test(value))
}
