import { SidebarPanel } from '#app/components/templates'
import {
	type IDesignWithType,
	type IDesignWithLayout,
} from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type designTypeEnum } from '#app/schema/design'
import { NewLayerDesignSchema } from '#app/schema/design-layer'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { LAYER_DESIGN_INTENT } from '../../../../intent'
import { SidebarPanelHeaderDesign } from '../../design/sidebar-panel-header-design'
import { PanelDesignTypeRowValues } from '../../design/type/panel-design-type-row-values'
import { PanelLayerDesignTypeRow } from './panel-layer-design-type-row'

export const PanelLayerDesignType = ({
	layerId,
	designs,
	type,
}: {
	layerId: ILayer['id']
	designs: IDesignWithType[]
	type: designTypeEnum
}) => {
	const {
		orderedDesignIds,
		designCount,
		visibleDesignIds,
		firstVisibleDesignId,
		selectedDesignId,
	} = panelListVariablesDesignType({
		designs,
	})

	return (
		<SidebarPanel>
			<SidebarPanelHeaderDesign
				type={type}
				layerId={layerId}
				visibleDesignsCount={visibleDesignIds.length}
				intent={LAYER_DESIGN_INTENT.layerCreateDesign}
				schema={NewLayerDesignSchema}
			/>

			{designs.map((design, index) => {
				const { id, visible } = design as IDesignWithLayout

				const {
					isSelectedDesign,
					nextDesignId,
					prevDesignId,
					nextVisibleDesignId,
				} = panelItemVariablesDesignType({
					id,
					selectedDesignId,
					orderedDesignIds,
					visibleDesignIds,
				})

				const {
					selectDesignIdOnMoveUp,
					selectDesignIdOnMoveDown,
					selectDesignIdOnToggleVisible,
					selectDesignIdOnDelete,
				} = selectedDesignsOnUpdate({
					id,
					selectedDesignId,
					isSelectedDesign,
					visible,
					prevDesignId,
					nextDesignId,
					nextVisibleDesignId,
					firstVisibleDesignId,
					orderedDesignIds,
				})

				return (
					<PanelLayerDesignTypeRow
						key={id}
						id={id}
						layerId={layerId}
						designCount={designCount}
						panelIndex={index}
						visible={visible}
						selectDesignIdOnMoveUp={selectDesignIdOnMoveUp}
						selectDesignIdOnMoveDown={selectDesignIdOnMoveDown}
						isSelectedDesign={isSelectedDesign}
						selectDesignIdOnToggleVisible={selectDesignIdOnToggleVisible}
						selectDesignIdOnDelete={selectDesignIdOnDelete}
					>
						<PanelDesignTypeRowValues type={type} design={design} />
					</PanelLayerDesignTypeRow>
				)
			})}
		</SidebarPanel>
	)
}
