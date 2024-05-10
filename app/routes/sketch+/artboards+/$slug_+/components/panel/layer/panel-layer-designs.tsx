import { type IDesignsByType } from '#app/models/design/design.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { designsByTypeToPanelArray } from '#app/utils/design'
import { PanelDesignType } from '../design/type/panel-design-type'

export const PanelLayerDesigns = ({
	layerId,
	designs,
}: {
	layerId: ILayer['id']
	designs: IDesignsByType
}) => {
	const designTypePanels = designsByTypeToPanelArray({ designs })

	return (
		<div>
			{designTypePanels.map(({ type, designs }) => (
				<PanelDesignType
					key={type}
					type={type}
					layerId={layerId}
					designs={designs}
				/>
			))}
		</div>
	)
}
