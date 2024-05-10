import { SidebarPanelPopoverFormContainer } from '#app/components/layout/popover'
import { Label } from '#app/components/ui/label'
import { Separator } from '#app/components/ui/separator'
import { type IArtboard } from '#app/models/artboard.server'
import { type ILayer } from '#app/models/layer.server'
import { PanelFormArtboardLayerDelete } from '../../forms/artboard/layer/panel-form-artboard-layer-delete'
import { PanelFormLayerEditDescription } from '../../forms/layer/panel-form-layer-edit-description'
import { PanelFormLayerEditName } from '../../forms/layer/panel-form-layer-edit-name'
import { PanelPopover } from '../panel-popover'

export const PanelPopoverLayer = ({
	artboardId,
	layer,
}: {
	artboardId: IArtboard['id']
	layer: ILayer
}) => {
	return (
		<PanelPopover name="layer">
			{/* name */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="name">Name</Label>
				<PanelFormLayerEditName artboardId={artboardId} layer={layer} />
			</SidebarPanelPopoverFormContainer>
			{/* description */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="description">Description</Label>
				<PanelFormLayerEditDescription artboardId={artboardId} layer={layer} />
			</SidebarPanelPopoverFormContainer>
			<Separator className="my-4" />
			{/* delete */}
			<SidebarPanelPopoverFormContainer>
				<Label htmlFor="delete">Delete</Label>
				<PanelFormArtboardLayerDelete id={layer.id} artboardId={artboardId} />
			</SidebarPanelPopoverFormContainer>
		</PanelPopover>
	)
}
