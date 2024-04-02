export const randomInRange = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randomIndex = <T>(array: T[]): number => {
	return Math.floor(Math.random() * array.length)
}

export const randomId = (): string => {
	return Math.random().toString(36).substring(2, 8)
}
