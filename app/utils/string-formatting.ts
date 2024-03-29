export function removeWhitespace(input: string): string {
	return input.replace(/\s/g, '')
}

export function trimSpacesInBetween(input: string): string {
	return input.replace(/\s+/g, ' ')
}

export function capitalize(input: string): string {
	return input.charAt(0).toUpperCase() + input.slice(1)
}

export function capitalizeFirstLetter(input: string): string {
	return input.charAt(0).toUpperCase() + input.slice(1)
}

export function transformSlugToTitle(input: string): string {
	return input
		.split('-')
		.map(word => capitalize(word))
		.join(' ')
}
