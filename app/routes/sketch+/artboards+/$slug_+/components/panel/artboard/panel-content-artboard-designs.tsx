import { type IDesignsByType } from '#app/models/design.server'
import { DesignTypeEnum } from '#app/schema/design'
import { type PickedArtboardType } from '../../../queries'
import { PanelArtboardDesignType } from './design/panel-artboard-design-type'
import { PanelContentArtboardBackgroundColor } from './panel-content-artboard-background-color'
import { PanelContentArtboardFrame } from './panel-content-artboard-frame'

export const PanelContentArtboardDesigns = ({
	artboard,
	designs,
}: {
	artboard: PickedArtboardType
	designs: IDesignsByType
}) => {
	const {
		designPalettes,
		designSizes,
		designFills,
		designStrokes,
		designLines,
		designRotates,
		designLayouts,
		designTemplates,
	} = designs

	const artboardId = artboard.id

	const designPanels = [
		{ type: DesignTypeEnum.LAYOUT, designs: designLayouts },
		{ type: DesignTypeEnum.PALETTE, designs: designPalettes },
		{ type: DesignTypeEnum.SIZE, designs: designSizes },
		{ type: DesignTypeEnum.FILL, designs: designFills },
		{ type: DesignTypeEnum.STROKE, designs: designStrokes },
		{ type: DesignTypeEnum.LINE, designs: designLines },
		{ type: DesignTypeEnum.ROTATE, designs: designRotates },
		{ type: DesignTypeEnum.TEMPLATE, designs: designTemplates },
	]

	return (
		<div>
			<PanelContentArtboardFrame artboard={artboard} />
			<PanelContentArtboardBackgroundColor artboard={artboard} />
			{designPanels.map(({ type, designs }) => (
				<PanelArtboardDesignType
					key={type}
					type={type}
					artboardId={artboardId}
					designs={designs}
				/>
			))}
		</div>
	)
}
