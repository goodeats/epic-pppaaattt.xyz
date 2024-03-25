import { type Artboard } from '@prisma/client'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { Label } from '#app/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '#app/components/ui/popover'
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
		<div>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="m-2 mr-0 flex h-8 w-8 cursor-pointer items-center justify-center"
					>
						<Icon name="gear">
							<span className="sr-only">Layer Settings</span>
						</Icon>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="font-medium leading-none">Layer</h4>
							<p className="text-sm text-muted-foreground">
								Settings for this layer.
							</p>
						</div>
						<div className="grid gap-2">
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="name">Name</Label>
								<PanelFormLayerEditName artboardId={artboardId} layer={layer} />
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="description">Description</Label>
								<PanelFormLayerEditDescription
									artboardId={artboardId}
									layer={layer}
								/>
							</div>
							<Separator className="my-4" />
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="delete">Delete</Label>
								<PanelFormArtboardLayerDelete
									id={layer.id}
									artboardId={artboardId}
								/>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
