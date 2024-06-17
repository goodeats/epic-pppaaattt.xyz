import { type IArtworkVersionWithChildren } from '#app/models/artwork-version/artwork-version.server'

export const getArtworkVersionContainer = ({
	version,
}: {
	version: IArtworkVersionWithChildren
}) => {
	const { width, height } = version
	return {
		width,
		height,
		top: 0,
		left: 0,
		margin: 0,
		canvas: {
			width,
			height,
		},
	}
}
