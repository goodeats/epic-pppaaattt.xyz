export const currentDateString = (): string => {
	// Create a date object for the current date and time
	const currentDate = new Date()

	// Format the date as a string in the format "YYYY-MM-DD"
	// with leading zeroes for MM and DD
	// and a "_" between the date and time
	// time in the format "HH-MM-SS"
	const dateString = `${currentDate
		.toISOString()
		.slice(0, 10)}_${addLeadingZeroes(
		currentDate.getHours(),
	)}-${addLeadingZeroes(currentDate.getMinutes())}-${addLeadingZeroes(
		currentDate.getSeconds(),
	)}`

	return dateString
}

const addLeadingZeroes = (n: number): string => {
	return n < 10 ? `0${n}` : `${n}`
}
