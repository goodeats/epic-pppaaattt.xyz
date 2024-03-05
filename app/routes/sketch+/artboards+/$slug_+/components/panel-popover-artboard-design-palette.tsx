import { type IPalette } from '#app/models/palette.server'

export const PanelPopoverArtboardDesignPalette = ({
	palette,
}: {
	palette: IPalette
}) => {
	return (
		<div>
			<div
				className="relative m-2 mr-0 h-4 w-4 overflow-hidden"
				style={{ backgroundColor: `#${palette.value}` }}
			></div>
		</div>
	)
}
