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

export const colorRandomHex = (): string => {
	let random = Math.floor(Math.random() * 16777215).toString(16)
	if (random.length === 5) {
		random = '0' + random
	}
	return random.toUpperCase()
}

export const colorInvertHexcode = (hex: string): string => {
	// Remove the hash at the start if it's there
	hex = hex.replace('#', '')

	// Convert hex to RGB
	const r = parseInt(hex.substring(0, 2), 16)
	const g = parseInt(hex.substring(2, 4), 16)
	const b = parseInt(hex.substring(4, 6), 16)

	// Invert each component
	const rInv = (255 - r).toString(16).padStart(2, '0').toUpperCase()
	const gInv = (255 - g).toString(16).padStart(2, '0').toUpperCase()
	const bInv = (255 - b).toString(16).padStart(2, '0').toUpperCase()

	// Combine and return the inverted hex code
	return `${rInv}${gInv}${bInv}`
}
