import { SidebarPanelRowReorderContainer } from '#app/components/templates'
import { type IDesign } from '#app/models/design.server'
import { type IArtboard } from '#app/utils/db.server'
import { PanelFormArtboardDesignReorder } from '../../../forms/artboard/design/panel-form-artboard-design-reorder'

export const SidebarPanelReorderArtboardDesign = ({
	id,
	artboardId,
	designCount,
	panelIndex,
	selectDesignIdOnMoveUp,
	selectDesignIdOnMoveDown,
}: {
	id: IDesign['id']
	artboardId: IArtboard['id']
	designCount: number
	panelIndex: number
	selectDesignIdOnMoveUp: IDesign['id'] | null | undefined
	selectDesignIdOnMoveDown: IDesign['id'] | null | undefined
}) => {
	return (
		<SidebarPanelRowReorderContainer>
			<PanelFormArtboardDesignReorder
				id={id}
				artboardId={artboardId}
				panelCount={designCount}
				panelIndex={panelIndex}
				direction="up"
				updateSelectedDesignId={selectDesignIdOnMoveUp}
			/>
			<PanelFormArtboardDesignReorder
				id={id}
				artboardId={artboardId}
				panelCount={designCount}
				panelIndex={panelIndex}
				direction="down"
				updateSelectedDesignId={selectDesignIdOnMoveDown}
			/>
		</SidebarPanelRowReorderContainer>
	)
}
