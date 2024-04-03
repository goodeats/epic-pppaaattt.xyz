import { SidebarPanelRowReorderContainer } from '#app/components/templates'
import { type IDesignIdOrNull, type IDesign } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import { type ReorderDesignSchemaType } from '#app/schema/design'
import { type IArtboard } from '#app/utils/db.server'
import { type IntentDesignReorder } from '../../../intent'
import { PanelFormDesignReorder } from '../../forms/design/panel-form-design-reorder'

export const SidebarPanelReorderDesign = ({
	id,
	artboardId,
	layerId,
	designCount,
	panelIndex,
	selectDesignIdOnMoveUp,
	selectDesignIdOnMoveDown,
	intent,
	schema,
}: {
	id: IDesign['id']
	artboardId?: IArtboard['id']
	layerId?: ILayer['id']
	designCount: number
	panelIndex: number
	selectDesignIdOnMoveUp: IDesignIdOrNull
	selectDesignIdOnMoveDown: IDesignIdOrNull
	intent: IntentDesignReorder
	schema: ReorderDesignSchemaType
}) => {
	return (
		<SidebarPanelRowReorderContainer>
			<PanelFormDesignReorder
				id={id}
				artboardId={artboardId}
				layerId={layerId}
				panelCount={designCount}
				panelIndex={panelIndex}
				direction="up"
				updateSelectedDesignId={selectDesignIdOnMoveUp}
				intent={intent}
				schema={schema}
			/>
			<PanelFormDesignReorder
				id={id}
				artboardId={artboardId}
				layerId={layerId}
				panelCount={designCount}
				panelIndex={panelIndex}
				direction="down"
				updateSelectedDesignId={selectDesignIdOnMoveDown}
				intent={intent}
				schema={schema}
			/>
		</SidebarPanelRowReorderContainer>
	)
}
