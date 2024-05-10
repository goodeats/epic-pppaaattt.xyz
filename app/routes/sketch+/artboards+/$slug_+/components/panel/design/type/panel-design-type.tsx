import { SidebarPanel } from '#app/components/templates'
import { type IArtboard } from '#app/models/artboard/artboard.server'
import {
	type IDesignWithType,
	type IDesignWithLayout,
} from '#app/models/design/design.server'
import { type ILayer } from '#app/models/layer/layer.server'
import { type designTypeEnum } from '#app/schema/design'
import { NewArtboardDesignSchema } from '#app/schema/design-artboard'
import { NewLayerDesignSchema } from '#app/schema/design-layer'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { ARTBOARD_DESIGN_INTENT, LAYER_DESIGN_INTENT } from '../../../../intent'
import { SidebarPanelHeaderDesign } from '../../design/sidebar-panel-header-design'
import { PanelDesignTypeRowValues } from '../../design/type/panel-design-type-row-values'
import { PanelDesignTypeRow } from './panel-design-type-row'

export const PanelDesignType = ({
	artboardId,
	layerId,
	designs,
	type,
}: {
	artboardId?: IArtboard['id']
	layerId?: ILayer['id']
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

	const newDesignIntent = artboardId
		? ARTBOARD_DESIGN_INTENT.artboardCreateDesign
		: LAYER_DESIGN_INTENT.layerCreateDesign

	const newDesignSchema = artboardId
		? NewArtboardDesignSchema
		: NewLayerDesignSchema

	return (
		<SidebarPanel>
			<SidebarPanelHeaderDesign
				type={type}
				artboardId={artboardId}
				layerId={layerId}
				visibleDesignsCount={visibleDesignIds.length}
				intent={newDesignIntent}
				schema={newDesignSchema}
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
					<PanelDesignTypeRow
						key={id}
						id={id}
						artboardId={artboardId}
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
					</PanelDesignTypeRow>
				)
			})}
		</SidebarPanel>
	)
}
