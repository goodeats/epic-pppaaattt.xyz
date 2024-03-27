// Function to get an item from an array in a circular manner.

import { randomIndex } from './random.utils'

// If the index is out of bounds, it wraps around the array.
export const getCircularItemInArray = <T>(array: T[], index: number): T => {
	return array[index % array.length]
}

// Function to get an item from an array in a reverse circular manner.
// It starts from the end of the array and wraps around in reverse order if the index is out of bounds.
export const getReverseCircularItemInArray = <T>(
	array: T[],
	index: number,
): T => {
	return array[array.length - 1 - (index % array.length)]
}

export const getRandomItemInArray = <T>(array: T[]): T => {
	return array[randomIndex(array)]
}
