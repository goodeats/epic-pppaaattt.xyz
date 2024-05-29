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
