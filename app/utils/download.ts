const CONST_FILE_NAME = 'pppaaattt'

export const downloadCanvasAsPNG = () => {
	const canvas = document.getElementById('canvas-editor') as HTMLCanvasElement
	const link = document.createElement('a')
	const filename = downloadImageFileName()
	link.download = filename
	link.href = canvas.toDataURL()
	link.click()
}

const downloadImageFileName = () => {
	const dateString = currentDateString()
	const format = 'png'
	const filename = `${dateString}_${CONST_FILE_NAME}.${format}`
	return filename
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const downloadJSON = (json: any) => {
	const element = document.createElement('a')
	const file = new Blob([JSON.stringify(json, null, 2)], {
		type: 'application/json',
	})
	const fileName = downloadJSONFileName()
	element.href = URL.createObjectURL(file)
	element.download = fileName
	document.body.appendChild(element) // Required for Firefox
	element.click()
}

const downloadJSONFileName = () => {
	const dateString = currentDateString()
	const format = 'json'
	const filename = `${dateString}_${CONST_FILE_NAME}.${format}`
	return filename
}

function currentDateString(): string {
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

function addLeadingZeroes(n: number): string {
	return n < 10 ? `0${n}` : `${n}`
}
