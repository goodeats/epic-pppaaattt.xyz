import { type IArtboardLayerBuild } from '../../../../queries'

export const canvasBuildLayerDrawCountService = ({
	layer,
}: {
	layer: IArtboardLayerBuild
}) => {
	const { layout } = layer
	const { style, count, rows, columns } = layout

	if (style === 'grid') {
		return rows * columns
	}

	return count
}
