import { type Artboard } from '@prisma/client'
import {
	SidebarPanelPopover,
	SidebarPanelPopoverContent,
	SidebarPanelPopoverFormContainer,
	SidebarPanelPopoverFormsContainer,
	SidebarPanelPopoverHeader,
	SidebarPanelPopoverTrigger,
} from '#app/components/templates'
import { Icon } from '#app/components/ui/icon'
import { Label } from '#app/components/ui/label'
import { Separator } from '#app/components/ui/separator'
import { type ILayer } from '#app/models/layer.server'
import { PanelFormArtboardLayerDelete } from '../../forms/artboard/layer/panel-form-artboard-layer-delete'
import { PanelFormLayerEditDescription } from '../../forms/layer/panel-form-layer-edit-description'
import { PanelFormLayerEditName } from '../../forms/layer/panel-form-layer-edit-name'

export const PanelPopoverLayer = ({
	artboardId,
	layer,
}: {
	artboardId: Artboard['id']
	layer: ILayer
}) => {
	return (
		<SidebarPanelPopover>
			<SidebarPanelPopoverTrigger>
				<Icon name="gear">
					<span className="sr-only">Layer Settings</span>
				</Icon>
			</SidebarPanelPopoverTrigger>
			<SidebarPanelPopoverContent>
				<SidebarPanelPopoverHeader
					title="Layer"
					description="Settings for this layer!"
				/>
				{/* forms */}
				<SidebarPanelPopoverFormsContainer>
					{/* name */}
					<SidebarPanelPopoverFormContainer>
						<Label htmlFor="name">Name</Label>
						<PanelFormLayerEditName artboardId={artboardId} layer={layer} />
					</SidebarPanelPopoverFormContainer>
					{/* description */}
					<SidebarPanelPopoverFormContainer>
						<Label htmlFor="description">Description</Label>
						<PanelFormLayerEditDescription
							artboardId={artboardId}
							layer={layer}
						/>
					</SidebarPanelPopoverFormContainer>
					<Separator className="my-4" />
					{/* delete */}
					<SidebarPanelPopoverFormContainer>
						<Label htmlFor="delete">Delete</Label>
						<PanelFormArtboardLayerDelete
							id={layer.id}
							artboardId={artboardId}
						/>
					</SidebarPanelPopoverFormContainer>
				</SidebarPanelPopoverFormsContainer>
			</SidebarPanelPopoverContent>
		</SidebarPanelPopover>
	)
}
