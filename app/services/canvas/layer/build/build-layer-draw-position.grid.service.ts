import { type ILayerGenerator } from '#app/definitions/artwork-generator'

export const getGridPosition = ({
	layer,
	index,
	ctx,
}: {
	layer: ILayerGenerator
	index: number
	ctx: CanvasRenderingContext2D
}) => {
	const { layout, container } = layer
	const { rows, columns } = layout
	const { width, height, top, left } = container

	// subtract 1 from denominator to get the proper step size
	// for example, if columns is 10, we want 10 divide by 9
	// so that the first and last positions on the grid are the edges
	// and not cells in the middle
	const stepX = width / (columns - 1)
	const stepY = height / (rows - 1)

	// quotient is the row index
	const rowIndex = Math.floor(index / columns)
	// remainder is the column index
	const columnIndex = index % columns

	// calculate the x and y position based on the row and column index
	// and the step size
	// add the top and left values to get the actual position
	// add margin later
	const x = columnIndex * stepX + left
	const y = rowIndex * stepY + top

	return { x, y }
}
