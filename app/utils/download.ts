import { currentDateString } from './dates'

const CONST_FILE_NAME = 'pppaaattt_xyz'

export const downloadCanvasToImg = ({
	canvas,
}: {
	canvas: HTMLCanvasElement
}) => {
	// const canvas = document.getElementById('canvas-editor') as HTMLCanvasElement
	const link = document.createElement('a')
	const filename = downloadImageFileName()
	link.download = filename
	link.href = canvas.toDataURL()
	link.click()
}

export const downloadImageFileName = () => {
	const dateString = currentDateString()
	const format = 'png'
	const filename = `${dateString}_${CONST_FILE_NAME}.${format}`
	return filename
}
