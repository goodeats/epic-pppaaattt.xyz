import { SidebarPanel } from '#app/components/templates'
import {
	type IDesignWithType,
	type IDesignWithLayout,
} from '#app/models/design.server'
import { type designTypeEnum } from '#app/schema/design'
import { NewArtboardDesignSchema } from '#app/schema/design-artboard'
import { type IArtboard } from '#app/utils/db.server'
import {
	panelItemVariablesDesignType,
	panelListVariablesDesignType,
	selectedDesignsOnUpdate,
} from '#app/utils/design'
import { ARTBOARD_DESIGN_INTENT } from '../../../../intent'
import { SidebarPanelHeaderDesign } from '../../design/sidebar-panel-header-design'
import { PanelDesignTypeRowValues } from '../../design/type/panel-design-type-row-values'
import { PanelArtboardDesignTypeRow } from './panel-artboard-design-type-row'

export const PanelArtboardDesignType = ({
	artboardId,
	designs,
	type,
}: {
	artboardId: IArtboard['id']
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
				artboardId={artboardId}
				visibleDesignsCount={visibleDesignIds.length}
				intent={ARTBOARD_DESIGN_INTENT.artboardCreateDesign}
				schema={NewArtboardDesignSchema}
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
					<PanelArtboardDesignTypeRow
						key={id}
						id={id}
						artboardId={artboardId}
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
					</PanelArtboardDesignTypeRow>
				)
			})}
		</SidebarPanel>
	)
}
