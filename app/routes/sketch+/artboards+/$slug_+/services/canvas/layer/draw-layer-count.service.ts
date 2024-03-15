import { type ILayout } from '#app/models/layout.server'

export const canvasDrawLayerCountService = ({
	layout,
}: {
	layout: ILayout
}) => {
	const { style, count, rows, columns } = layout

	if (style === 'random') {
		return { count }
	}

	const gridCount = rows * columns
	return { count: gridCount }
}
