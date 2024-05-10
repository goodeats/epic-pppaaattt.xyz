import {
	SidebarPanelHeader,
	SidebarPanelRowActionsContainer,
} from '#app/components/templates'
import { type IArtboard } from '#app/models/artboard/artboard.server'
import { type ILayer } from '#app/models/layer/layer.server'
import {
	type NewDesignSchemaType,
	type designTypeEnum,
} from '#app/schema/design'
import { capitalize } from '#app/utils/string-formatting'
import { type IntentDesignCreate } from '../../../intent'
import { PanelFormDesignNew } from '../../forms/design/panel-form-design-new'

export const SidebarPanelHeaderDesign = ({
	type,
	artboardId,
	layerId,
	visibleDesignsCount,
	intent,
	schema,
}: {
	type: designTypeEnum
	artboardId?: IArtboard['id']
	layerId?: ILayer['id']
	visibleDesignsCount: number
	intent: IntentDesignCreate
	schema: NewDesignSchemaType
}) => {
	return (
		<SidebarPanelHeader title={capitalize(type)}>
			<SidebarPanelRowActionsContainer>
				<PanelFormDesignNew
					type={type}
					artboardId={artboardId}
					layerId={layerId}
					visibleDesignsCount={visibleDesignsCount}
					intent={intent}
					schema={schema}
				/>
			</SidebarPanelRowActionsContainer>
		</SidebarPanelHeader>
	)
}
