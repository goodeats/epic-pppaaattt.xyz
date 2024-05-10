import { SidebarPanelRowActionsContainer } from '#app/components/templates'
import { type IArtboard } from '#app/models/artboard/artboard.server'
import { type IDesignIdOrNull, type IDesign } from '#app/models/design.server'
import { type ILayer } from '#app/models/layer.server'
import {
	type ToggleVisibleDesignSchemaType,
	type DeleteDesignSchemaType,
} from '#app/schema/design'
import {
	type IntentDesignToggleVisible,
	type IntentDesignDelete,
} from '../../../intent'
import { PanelFormDesignDelete } from '../../forms/design/panel-form-design-delete'
import { PanelFormDesignToggleVisible } from '../../forms/design/panel-form-design-toggle-visible'

export const SidebarPanelActionsDesign = ({
	id,
	artboardId,
	layerId,
	visible,
	isSelectedDesign,
	selectDesignIdOnToggleVisible,
	selectDesignIdOnDelete,
	toggleVisibleIntent,
	toggleVisibleSchema,
	deleteIntent,
	deleteSchema,
}: {
	id: IDesign['id']
	artboardId?: IArtboard['id']
	layerId?: ILayer['id']
	visible: boolean
	isSelectedDesign: boolean
	selectDesignIdOnToggleVisible: IDesignIdOrNull
	selectDesignIdOnDelete: IDesignIdOrNull
	toggleVisibleIntent: IntentDesignToggleVisible
	toggleVisibleSchema: ToggleVisibleDesignSchemaType
	deleteIntent: IntentDesignDelete
	deleteSchema: DeleteDesignSchemaType
}) => {
	return (
		<SidebarPanelRowActionsContainer>
			<PanelFormDesignToggleVisible
				id={id}
				artboardId={artboardId}
				layerId={layerId}
				visible={visible}
				updateSelectedDesignId={selectDesignIdOnToggleVisible}
				intent={toggleVisibleIntent}
				schema={toggleVisibleSchema}
			/>
			<PanelFormDesignDelete
				id={id}
				artboardId={artboardId}
				layerId={layerId}
				isSelectedDesign={isSelectedDesign}
				updateSelectedDesignId={selectDesignIdOnDelete}
				intent={deleteIntent}
				schema={deleteSchema}
			/>
		</SidebarPanelRowActionsContainer>
	)
}
