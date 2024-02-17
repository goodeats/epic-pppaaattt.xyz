import { type Artboard } from '@prisma/client'
import { SideNavTabText } from '#app/components/shared'

export const PanelContentArtboard = ({
	artboard,
}: {
	artboard: Pick<Artboard, 'width' | 'height' | 'backgroundColor'>
}) => {
	return (
		<div>
			<SideNavTabText>Frame</SideNavTabText>
		</div>
	)
}
